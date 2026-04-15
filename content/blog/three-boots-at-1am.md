---
title: "Three Boots at 1am: Migrating Root With Claude Code"
created_at: 2026-03-12T01:00:00Z
updated_at: 2026-03-12T01:00:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "How I moved my Arch Linux root from a 27G Intel Optane to a 476G NVMe at 1am, guided by an AI that caught its own bugs when I asked it to look."
tags: ["arch-linux", "sysadmin", "claude-code", "nvme"]
---

The third time you boot from a USB stick at 1am, you stop reading the output. You just stare at it. The terminal glows in the dark and you type `lsblk` like a prayer, and the disks have switched names again. nvme0n1 is now what nvme1n1 was an hour ago. The script you trusted — the script you trusted more than you trust most people — just tried to repartition the wrong disk.

You sit back. The fan hums. Somewhere deep in `drivers/nvme/host/core.c`, a function called `nvme_init_ctrl` decided to enumerate your drives in a different order, because the PCIe bus topology felt like it today. No promise was broken. None was ever made.

This is the story of how that happened.

---

## The Problem

My Dell laptop came with two NVMe drives: an Intel Optane H10 — 27 gigabytes of 3D XPoint doing its best impression of usefulness — and a regular NAND, 476 gigabytes of actual storage. When I installed Arch, the installer saw the Optane first, so root landed on it. /home went to the NAND. Fast disk for the system. Big disk for files. The kind of logic that sounds brilliant at midnight and stupid by morning.

It stopped making sense around the time `df -h` started reading like a threat:

```
/dev/nvme0n1p2   26G   22G   3G   88% /
/dev/nvme1n1p1  476G   22G  432G   5% /home
```

Root at 88%. Home at 5%. Every `pacman -S` was a diplomatic negotiation with three gigabytes of free space. `docker pull` was out of the question. Even `journalctl` was slowly eating me alive — systemd doesn't believe in moderation when it comes to logging. I was rationing installs on a machine with 450 gigs sitting empty, like owning a mansion and sleeping in the closet.

The fix was obvious: move root to the big disk. Shrink the ext4 filesystem on the NAND, split the partition, `rsync` everything over, regenerate GRUB. The kind of thing that's three sentences to describe and three hours to survive.

---

## The Plan

I'd spent the entire day installing Arch from scratch — wiped Windows, configured everything from the bootloader up, fought with drivers, got Hyprland running, set up my whole environment. By 1am I was done, running `df -h` out of habit, and that's when I saw root sitting at 88% on the Optane. The system I'd just spent twelve hours building was already out of space. Fuck. I was not going to reinstall. Not tonight. Not after all that. I knew how to do the migration manually — I'd done partition work before — but at 1am, tired, on my only machine, with no backup? My hands would be the most dangerous thing in the room. So the logic was simple: let the AI write the script, review it carefully, and if it fails, I'm reinstalling anyway — same outcome as if I fat-fingered `parted` at 1am by myself, except this way I might actually sleep tonight.

So I asked Claude Code to write a script that would repartition my only computer. No backup disk. No second machine. No Timeshift snapshot. But I didn't type "plz fix my disks" and wait for magic. That's not how any of this works. I gave it the full picture: the current partition layout, the target layout, the exact sizes in GiB, which disk was which, what filesystem each partition used, where the EFI partition lived, that this had to run from a live USB where nothing is mounted by default. I told it the script needed to be interactive — confirmations at every step — because I wasn't going to let 400 lines of bash run unattended on my only machine. I told it to use `set -euo pipefail` and to verify UUIDs at the end. The more specific you are with the prompt, the less the AI has to guess. And when you're repartitioning live, you want zero guessing.

It produced 400 lines of bash with 9 interactive steps. Colored output — cyan for info, green for success, red for failure, yellow for warnings. Helper functions: `info()`, `ok()`, `warn()`, `fail()`. Yes/no confirmations at every step, because the script was polite enough to ask before destroying things. It felt safe, the way a seatbelt feels safe right before the crash.

---

## The Reviews That Saved Everything

Here's the thing about AI-generated code: the first draft is never the one you run. Not on production. Not on your only machine at 1am. If you run the first draft, you deserve what happens next.

Before running anything, I told Claude to review its own script — not once, but using multiple subagents in parallel, each one focused on a different class of problem. One checked the resize arithmetic. Another looked at error handling with `set -e`. Another traced every device path to see if they were consistent. Another checked the GRUB and fstab logic. They came back with five bugs. Two of them would have destroyed my filesystem.

I read every single finding. Not because I didn't trust the AI — I trusted it enough to write the script — but because trust without verification is just hope, and hope doesn't survive `mkfs.ext4` on the wrong partition.

The worst one was arithmetic. `resize2fs` takes a filesystem size. `parted resizepart` takes a partition *end position* — an offset from byte zero of the disk. The script would resize the filesystem to exactly 432 GiB, then set the partition end at 432 GiB:

```bash
resize2fs /dev/nvme1n1p1 432G     # filesystem: exactly 432 GiB
parted resizepart 1 432GiB        # partition END at 432 GiB from disk start
# partition START at ~1MiB (GPT alignment)
# actual partition SIZE ≈ 431.999 GiB
# filesystem overflows partition by 1 MiB → silent corruption
```

The filesystem would have been bigger than its container by one megabyte. The superblock wouldn't know. `fsck` wouldn't catch it. Writes near the end of the filesystem would land in unallocated space past the partition boundary. Not an error. Not a warning. Just data going to a place that doesn't belong to anyone, waiting to be overwritten by the next `mkfs`. The kind of silent corruption that doesn't announce itself — it just waits until you need the data, and then it's gone.

The fix was two gigabytes of headroom:

```bash
resize2fs /dev/nvme1n1p1 430G     # 2 GiB smaller than partition
```

Paranoid? Sure. But `resize2fs` sizes the filesystem content, and `parted` sets an end offset from byte zero of the disk — the partition start alignment eats a megabyte you forgot to subtract. Two gigs of wasted space buys you sleep.

The second bug was ironic. `e2fsck` has its own exit code scheme: 0 means no errors found, 1 means errors were found *and corrected* — success, in `e2fsck`'s mind, but not in bash's. The script had `set -euo pipefail`. Exit code 1 plus `set -e` means bash kills the script for succeeding:

```bash
set -euo pipefail
e2fsck -f /dev/nvme1n1p1  # returns 1 = "I fixed things"
# bash interprets 1 as failure → script aborts at step 1
# you are now staring at a half-checked filesystem
```

Brilliant. The filesystem checker successfully repairs something, reports its success, and bash murders the entire script in response. `set -e` doesn't know what success means — it only knows what zero means.

The fix was a wrapper that treats exit codes 0 and 1 as success, because `e2fsck` has its own ideas about what success means.

There were three more: a bare `grep` that would trigger `set -e` and kill the script if GRUB used a different config format (grep returns 1 on no match — sensing a pattern?), `rsync` without `--numeric-ids` which would scramble UID/GID mappings when run from a live USB where `cativo23` doesn't exist, and a hardcoded `root=UUID=...` in `/etc/default/grub` that would survive `grub-mkconfig` and point the bootloader at a partition that's no longer root.

The AI found bugs in its own code before I ran it. Five bugs, two of them catastrophic, discovered by parallel review agents arguing with each other about edge cases. But here's what matters: it found them because I *asked* it to look. The default output — the first draft — had all five bugs. If I'd run that first draft, I'd be reinstalling Arch right now instead of writing this.

AI code generation is not magic. It's a first draft that's really fast and mostly right. The AI is the tool. You're still the engineer.

---

## First Attempt: The Disk Swap

I booted the Arch USB, mounted /home, ran the script. It died immediately. Well — it didn't die. It tried to `resize2fs` the Optane, which would have been worse.

The script had every device path hardcoded. `/dev/nvme0n1` was the Optane in my running system. But the kernel on the USB stick enumerated them in reverse. The Optane was now `nvme1n1`. The NAND was `nvme0n1`. The script was about to shrink a 27-gigabyte drive to 430 gigs. That's not how physics works, but bash doesn't know that — it would have tried, and the error message would have been the least of my problems.

Linux does not guarantee NVMe enumeration order between boots. The kernel walks the PCIe topology, finds controllers, and assigns `/dev/nvme*` in whatever order the bus scan completes. Reboot with a USB plugged in and the timing changes. It's not a bug. It's not documented as a feature either. It's just how `nvme_init_ctrl` works, and it will humble you at 1am.

I went back to Claude, explained what happened — "the disks swapped names on the live USB, look at this `lsblk` output" — and asked for a fix. This is the part people skip when they talk about AI tools: you have to *tell it what went wrong*. Give it the error output. Give it the actual state of the world. The AI can't see your screen. It doesn't know the disks swapped unless you say so. The quality of the fix is directly proportional to the quality of the bug report.

The fix was to stop trusting names and start trusting sizes:

```bash
for dev in /dev/nvme0n1 /dev/nvme1n1; do
    size_gb=$(lsblk -bno SIZE "$dev" | head -1)
    size_gb=$((size_gb / 1073741824))
    if [[ $size_gb -lt 50 ]]; then
        OPTANE_DISK="$dev"
    else
        NAND_DISK="$dev"
    fi
done
```

Twenty-seven is always less than fifty. The Optane can't lie about being small.

---

## Second Attempt: The Chicken and the Egg

The script lived on /home. /home lived on the NAND. The script needed to `umount` the NAND to run `resize2fs` on it — because you can't resize a mounted ext4 filesystem downward, only upward. But if /home is unmounted, bash can't read the script, because the script is on /home. Classic deadlock. The kind of shit that makes you question whether you thought about this at all.

I tried `umount -l` (lazy unmount) first, because it sounded clever. It detaches the mountpoint from the VFS but keeps the underlying block device busy until all file descriptors close. Which means `resize2fs` would still refuse to touch it. Lazy unmount: the systemd of unmounting. Sounds helpful, does nothing useful.

Then I found a Kingston 58G in a drawer, copied the script to it with `cp ~/migrate-root.sh /mnt/usb/`, and booted again.

Sometimes the solution to a systems problem is a thing you forgot you owned.

---

## Third Attempt: It Works

Nine confirmations. Each one a small prayer typed into a dark terminal.

`e2fsck -f` passed clean — exit code 0 this time, no fixes needed. `resize2fs` shrank the filesystem from 476 GiB to 430 GiB in about forty seconds. The progress bar moved in chunks, relocating blocks from the tail end of the filesystem to free space closer to the front. ext4 is good at this. It keeps a block bitmap and just... rearranges things. Quietly.

`parted resizepart 1 432GiB` carved the partition boundary. `mkpart primary ext4 432GiB 100%` claimed the remaining ~45 GiB. `mkfs.ext4` formatted it in two seconds — the superblock, the group descriptors, the inode table, the journal. A brand new filesystem with nothing in it, waiting.

Then the `rsync`:

```bash
rsync -axHAXv --numeric-ids /mnt/oldroot/ /mnt/newroot/
```

The `-a` flag is archive mode — recursive, preserves symlinks, permissions, timestamps, group, owner, device files, specials. `-x` stays on one filesystem, so it won't follow mountpoints into /home, /boot, /proc, or /sys. `-H` preserves hard links. `-A` preserves ACLs. `-X` preserves extended attributes. `--numeric-ids` is the one that matters most here: on a live USB, the user `cativo23` doesn't exist in `/etc/passwd`, so rsync would try to map UIDs by name, fail, and default to root. Every file owned by uid 1000 would become owned by uid 0. You'd boot into a system where your user can't read its own config files. `--numeric-ids` says "don't think, just copy the numbers." 13 gigabytes. About four minutes.

`genfstab -U /mnt/newroot` generated a fresh `/etc/fstab` with the new UUIDs — because every `mkfs.ext4` creates a new UUID, and the old fstab still pointed at the old partition. Then `arch-chroot /mnt/newroot` to regenerate `grub.cfg` with `grub-mkconfig -o /boot/grub/grub.cfg` and rebuild the initramfs with `mkinitcpio -P`. The chroot exits. The script prints every UUID it found — root, home, boot — next to what fstab and GRUB expect. They match.

Reboot. Pull the USB. The GRUB menu appears. Login screen loads. I type `df -h` the way you check your pulse after a fall:

```
/dev/nvme0n1p2   44G   14G   29G  32% /
/dev/nvme0n1p1  423G   22G  379G   6% /home
```

```
nvme0n1     476.9G
├─nvme0n1p1   432G ext4   /home
└─nvme0n1p2  44.9G ext4   /
nvme1n1      27.3G
├─nvme1n1p1     1G vfat   /boot
└─nvme1n1p2  26.2G ext4
```

Twenty-nine gigabytes free. Holy shit, it actually worked. `findmnt` confirmed root on `nvme0n1p2`. `cat /etc/fstab` showed all UUIDs matching. `efibootmgr -v` showed GRUB still loading from the Optane's EFI partition. Everything pointed where it should.

The old root on the Optane still intact, untouched, a fallback I hope I never need. If the new root ever corrupts, I can boot the USB, mount `nvme1n1p2`, fix GRUB, and be back in business. It's 22 gigs of insurance. Cheap.

---

## The Morning After

The migration was done. Root had 29 gigs free. I gave it six hours before something filled it up again.

I had 44 gigs now, but I'd watched how fast 26 gigs filled up. What would fill this one? Docker was the obvious answer. All those images, containers, volumes, build cache — everything living in `/var/lib/docker`, which lives on root. One `docker pull postgres` and you've lost a gigabyte. Three `docker-compose up` cycles with different Node versions and you're negotiating with `docker system prune` like it owes you money.

I stopped Docker, rsync'd everything to `/home/docker`, pointed `data-root` at the new location, and started it back:

```bash
systemctl stop docker docker.socket containerd
rsync -aAXH /var/lib/docker/ /home/docker/
echo '{"data-root":"/home/docker"}' > /etc/docker/daemon.json
systemctl start docker
```

The rsync needs `-AXH` because Docker's overlay2 storage driver cares about xattrs more than it cares about your feelings. `docker info | grep "Docker Root Dir"` confirmed `/home/docker`. Then `rm -rf /var/lib/docker` — the only `rm -rf` I've ever typed with genuine satisfaction.

I asked Claude what else could bloat root over time. Pacman cache and systemd journals — both bottomless by default. Arch never cleans `/var/cache/pacman/pkg/` — every package you download stays there, old versions piling up alongside new ones. It's not a cache, it's a hoarder's closet. I enabled `paccache.timer` to trim it weekly:

```bash
sudo systemctl enable --now paccache.timer
```

Keeps the last three versions, deletes the rest. The kind of cleanup you set once and forget exists until it saves you six months later.

Then `journalctl`. Systemd's journal defaults to 10% of the filesystem, capped at 4 gigs — which sounds reasonable until you realize that on a 44-gig root, that's 4.4 gigabytes of logs competing with your actual system. I found 800 megabytes already and the system was two months old. I tightened it in `/etc/systemd/journald.conf`:

```ini
SystemMaxUse=200M
```

Two hundred megabytes of logs is more than enough to debug anything you'll actually debug. The rest is just systemd narrating your life to `/var/log/journal/` like an unsolicited biographer.

The Optane sits empty now. Twenty-seven gigabytes of 3D XPoint doing nothing. Intel designed that chip for caching — it was supposed to sit between the CPU and the NAND, accelerating reads with its absurdly low latency. That low latency — roughly 10 microseconds for Optane versus 20-100 for NAND flash — makes it a decent swap device, since swap is all about random small reads under memory pressure. `mkswap /dev/nvme1n1p2` and a line in fstab. Someday. For now it just holds the old root, untouched, a snapshot of the system from before I rearranged its organs at 1am because `df -h` hurt my feelings.

I spent more time protecting 44 gigabytes than most people spend on backups. But that's what happens when it's your only machine and you're too stubborn to reinstall.

---

## What I Know Now

NVMe device names are suggestions, not promises — use `lsblk` sizes or `/dev/disk/by-uuid/` like a civilized person. `set -e` will kill your script for doing its job, and `e2fsck` will return 1 to thank you for asking. A filesystem must always be smaller than its partition, because `resize2fs` and `parted` don't agree on what a gigabyte is, and neither of them will warn you. Never delete the old root — it's the only thing between you and a four-hour reinstall at 3am. Docker doesn't belong on root, pacman doesn't clean up after itself, and systemd will happily dedicate 10% of your root to logs about how everything is fine.

And about the AI thing: Claude Code wrote the script that migrated my root partition, found the bugs in its own script, fixed the disk enumeration issue when I reported it, and helped me harden the system afterward. It did all of that. But it did none of it unprompted. I described the problem in detail. I asked for specific reviews. I read every line of output. I told it when things broke and *how* they broke. Before the final run, I told Claude to double-check everything — run `shellcheck`, make sure nothing was off. It passed clean. The AI was the most competent pair programmer I've ever had — but it still needed a human at the keyboard who knew what questions to ask and when to say "wait, that doesn't look right."

The people who say "AI will replace engineers" and the people who say "AI is useless" are both wrong in the same way. They both think it's supposed to work alone.

The [full script is here](GIST_URL), if you're the kind of person who reads other people's bash scripts at 2am.

Three boots, two catastrophic bugs caught before they fired, one partition table that finally makes sense, and a mass of 3D XPoint sitting idle because I haven't gotten around to `mkswap`. It's 2am. The fan hums. The terminal is still open. I should go to bed, but `df -h` looks so good now I keep running it.
