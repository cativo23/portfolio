---
title: "One Partition to Rule Them All: The Sequel Nobody Asked For"
created_at: 2026-04-14T00:00:00Z
updated_at: 2026-04-14T00:00:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "A month after migrating root to a 45G partition, it filled up again. So I deleted it entirely and merged everything into one 477G disk. Twenty-four AI agents reviewed the script before I ran it. The disks swapped names again."
tags: ["arch-linux", "sysadmin", "claude-code", "nvme", "partitions"]
---

A month after the last migration, I ran `df -h` and laughed. Not the good kind.

```
/dev/nvme0n1p2   44G   38G   4.1G  91% /
/dev/nvme0n1p1  432G   89G  321G  22% /home
```

Ninety-one percent. Four gigs free. The same goddamn feeling as last time — a large disk sitting mostly empty while root chokes on its own organs. Except this time I had 44 gigabytes, not 26. I'd moved Docker to /home. I'd enabled paccache.timer. I'd capped journald at 200 megs. I'd done everything right, and root was full anyway, because 44 gigabytes is not a root partition — it's a grace period.

Flatpaks. That's what killed it this time. Flatpak stores everything in `/var/lib/flatpak`, which lives on root, because of course it does. Each app pulls its own runtime — a frozen slice of GNOME or KDE or freedesktop.org, duplicated per application because isolation is more important than your disk space. Install five apps, get three copies of `org.gnome.Platform`. Each one weighs a gigabyte. Flatpak doesn't ask. It doesn't warn. It just fills your root like water filling a basement.

I could have moved Flatpak to /home too. Symlink `/var/lib/flatpak` to `/home/flatpak`, the same trick I'd used for Docker. But I was running out of things to relocate. Docker on /home. Flatpak on /home. Pacman cache on /home. At some point you're not managing a partition — you're managing an elaborate system of redirects that exists solely because you drew the wrong line on a disk five months ago. That's not system administration. That's bullshit.

The two-partition layout was the problem. Not Docker, not Flatpak, not systemd's logging habits. The problem was that I had 477 gigabytes and I'd split them into a place where things live and a place where things work, and the place where things work was always too small, and the place where things live was always too empty. Two partitions on a single-user laptop is a solution to a problem I don't have.

So I decided to delete the partition.

---

## The Plan (Again)

The layout I had:

```
nvme0n1     476.9G
├─nvme0n1p1   432G ext4   /home
└─nvme0n1p2  44.9G ext4   /

nvme1n1      27.3G
├─nvme1n1p1     1G vfat   /boot
└─nvme1n1p2  26.2G ext4   (old root backup from last time)
```

The layout I wanted:

```
nvme0n1     476.9G
└─nvme0n1p1 476.9G ext4   /       ← everything

nvme1n1      27.3G
├─nvme1n1p1     1G vfat   /boot
└─nvme1n1p2  26.2G ext4   (can be wiped later)
```

One partition. Root and home together. No more capacity planning, no more symlink gymnastics, no more watching 300 gigs sit idle while `pacman -Syu` fails because `/var` is full. Just one big ext4 with everything on it, the way a single-user system should have been from the start.

The catch: nvme0n1p1 was /home. nvme0n1p2 was root. I couldn't just delete p2 and call it done — root's files had to end up on p1. And I couldn't resize p1 while p2 existed next to it on the same disk, because GPT partitions can only grow into adjacent free space, and p2 was in the way.

So: back up root to nvme1n1p2 (the 26G spare partition that still had the old backup from last time — ironic), delete nvme0n1p2, grow nvme0n1p1 from 432G to 477G, copy root files from the backup into the now-merged partition. Update fstab. Reinstall GRUB. Pray.

Same recipe as last time. Except this time, the data I cared about — /home — was on the partition I was *resizing*. Last time, /home was untouched. This time, one wrong flag to `parted` and my entire home directory would be reformatted into a blank ext4. My projects, my dotfiles, my SSH keys — all of it. The margin for error went from "you'll have to reinstall" to "you'll lose everything."

I was not doing this by hand.

---

## Two Scripts, Twenty-Four Agents

Last time, Claude wrote one script and I ran it after one round of review. It worked — barely — after three boots and a USB stick I found in a drawer. This time I wanted something more disciplined. I was older. Wiser. Marginally less reckless.

I asked Claude Code for two scripts: `backup.sh` to run on the live system, and `automigrate.sh` to run from a live USB. Separation of concerns — the backup happens while everything is stable and mounted, the dangerous work happens when nothing is mounted and nothing can go wrong except everything.

`backup.sh` was straightforward. Verify disk layout, check sizes, format the spare 26G partition, `rsync` everything on `/` to it, save metadata, write a sentinel file (`.backup-complete`) so the migration script can verify the backup finished. The sentinel matters because `rsync` can be interrupted — if you kill it mid-copy and the migration script trusts the partial backup, you'll restore a root filesystem missing half of `/usr/lib`. Good luck booting that. The sentinel is a timestamp written after rsync and verification both pass. No sentinel, no migration.

`automigrate.sh` was the scary one. 470 lines of bash that deletes a partition, resizes another one while your data is on it, copies a root filesystem, writes an fstab, installs GRUB from inside a chroot, and verifies every UUID in the chain from BIOS to kernel. The kind of script where a misplaced `mkfs` or a wrong device path means you're restoring from backups — assuming you have backups, assuming the backup script didn't also have bugs.

So I didn't run it after one round of review. I ran six.

Each round dispatched three to four specialized agents in parallel — not the same generic "check for bugs" request, but focused roles. A code reviewer looking for logic errors and crashes. A chaos engineer imagining power failures, partial writes, killed processes. A dry-run simulator mentally executing every line with the actual disk layout. An Arch Linux boot specialist verifying the GRUB/fstab/mkinitcpio chain. A variable tracer following every `$HOME_PART` and `$NEW_UUID` through every conditional branch.

Twenty-four agents across six rounds. Each round focused on what the previous round missed, not on re-reporting fixed issues. By round four, the format was GO/NO-GO — only critical and high severity, skip the medium and low. By round six, all four agents returned GO independently.

They found ten bugs across those rounds. Some were cosmetic. Some would have killed my system.

---

## The Bugs That Would Have Killed It

The first draft used `sgdisk` to delete partition 2, then used `sgdisk` again to recreate partition 1 at a larger size. Delete and recreate. The problem: between the delete and the recreate, the partition table has no entry for partition 1. If the power goes out — if the kernel panics, if someone trips over the power cord, if the battery dies because you forgot to plug in the laptop — the disk has zero partitions. Your /home data is still on the raw blocks, but the partition table doesn't know that. You'd need a partition recovery tool and a lot of patience. And probably a drink.

The fix was `parted resizepart 1 100%` — a single atomic operation that grows the partition in place. No delete step. No window where the partition entry is missing. The data on p1 never moves, because ext4 block addresses are relative to the partition start, and the start doesn't change. Only the end moves. `parted` updates the GPT entry, the kernel rereads the table, and the partition is bigger. If the power fails during the operation, the old size is still valid — you just didn't grow it yet.

The e2fsck bug came back. Same shit, different script. `set -euo pipefail` and `e2fsck` still don't agree on what exit code 1 means. But this time the agents caught something deeper: what if `e2fsck` finds *serious* corruption? Exit codes 0-3 are fixable. Exit code 4 means uncorrected errors — the kind of corruption where letting `e2fsck -y` auto-repair might make things worse, rewriting directory structures based on guesses about what the filesystem was supposed to look like. On a clean system, `-y` is fine. On a filesystem with deep structural damage, `-y` is a coin flip that might delete your files while "fixing" them.

The fix was a two-pass approach: first `e2fsck -f -n` (read-only, don't touch anything), check the exit code. If it's 4 or higher, abort with a message that says "DO NOT auto-repair /home — run e2fsck manually." If it's 0-3, proceed with `e2fsck -f -y` for actual repair. The read-only pass costs thirty seconds and prevents the script from cheerfully destroying a corrupted filesystem on autopilot.

Then round five found the thing that made me sit back in my chair and say "oh, fuck."

When nvme0n1p1 was mounted as `/home` in the original system, the filesystem root contained `cativo23/` directly — not `home/cativo23/`. That's how mount points work: you mount a partition at `/home`, and the top-level directories on that partition *become* what's under `/home`. The partition itself doesn't know it's called `/home`. It just has a directory called `cativo23/` at its root.

After the migration, that partition *is* root. The filesystem root now contains `cativo23/` where it should contain `home/cativo23/`. Without relocation, the user's home directory would be at `/cativo23` instead of `/home/cativo23`. Every dotfile, every path in every config, every `$HOME` reference — wrong. The system would boot, but nothing would work the way it should. Every application that reads `$HOME` would point to the right path but find nothing there. Login might work. Everything after that would be broken.

```bash
if [ -d "$NEWROOT/cativo23" ] && [ ! -d "$NEWROOT/home/cativo23" ]; then
    mkdir -p "$NEWROOT/home"
    mv "$NEWROOT/cativo23" "$NEWROOT/home/cativo23"
fi
```

Four lines. The `mv` is atomic on ext4 — it's a single directory rename within the same filesystem, so there's no partial state if the power fails mid-operation. The conditional makes it idempotent: if you run the script twice, the second run sees `/home/cativo23` already exists and skips the move. The kind of fix that's obvious *after* someone points it out, and invisible *before*.

A dry-run simulator found it. An agent that was told "mentally execute every line with this exact filesystem layout" and traced what each directory check would see. It flagged the user relocation as CRITICAL because it simulated what `/mnt/newroot/cativo23` would look like after mounting a partition that had been /home. None of the other agents — the code reviewer, the chaos engineer, the boot specialist — noticed. They were looking at the code. The simulator was looking at the data. That's why you run different agents with different perspectives. They don't find the same bugs, and the bug that matters is always the one nobody else was looking for.

---

## The Quiet Bugs

Not every fix was dramatic. Some were the kind of thing you'd miss reading the script at midnight but would bite you at runtime.

`grep -oP` — the Perl-compatible regex flag — doesn't exist on every system. Some minimal environments ship `grep` without PCRE support. On a live USB, you're running whatever the ISO packed. The script extracted UUIDs from GRUB config using `-oP` with `|| true` to suppress errors, which meant if PCRE wasn't supported, grep would fail silently, the UUID variable would be empty, and the mismatch check would pass because you can't mismatch against nothing. Sneaky as hell. The fix was `grep -oE` (extended regex, always available) plus `sed` for the extraction.

The backup script used `blockdev --getsize64` to check partition size before formatting. The command was wrapped in `|| true` on the assignment line — standard shell defensiveness. But `|| true` on an assignment means the assignment *always succeeds*: if `blockdev` fails, the variable is empty, and `|| true` prevents `set -e` from catching it. The subsequent arithmetic would either fail with "integer expression expected" (ugly) or silently compute with zero (dangerous). The fix was removing `|| true` from the assignment and adding an explicit check for empty or zero afterward.

The GRUB UUID check deserves its own paragraph. The script checked `/etc/default/grub` for hardcoded `root=UUID=` entries that might not match the new root UUID. The first draft warned about the mismatch but didn't pause — it printed a warning, then ran `grub-mkconfig`, which dutifully generated a `grub.cfg` pointing at the wrong partition. The system would boot, GRUB would load, and the kernel would panic because root doesn't exist at that UUID. A NO-GO finding from round four: the warning must pause with `read -r` and let you fix the file *before* grub-mkconfig runs, not after. Print a warning after the damage is done? That's not a warning. That's a postmortem.

---

## Running It

I copied `automigrate.sh` to the same Kingston 58G USB that saved me last time. Booted the Arch live ISO. The familiar terminal. The familiar `lsblk` prayer:

```
nvme0n1     476.9G
├─nvme0n1p1   432G ext4
└─nvme0n1p2  44.9G ext4

nvme1n1      27.3G
├─nvme1n1p1     1G vfat
└─nvme1n1p2  26.2G ext4
```

Same names this time. The PCIe bus was feeling cooperative. Or maybe the kernel was in a good mood. Either way, the device paths matched. The script's pre-flight checks passed: live USB confirmed, no stale mounts, backup verified with sentinel present, /home data confirmed (`cativo23/` found on nvme0n1p1).

Press Enter to delete nvme0n1p2. One keypress. The partition that held my root for a month — the partition I'd spent the previous migration so carefully creating — gone in a fraction of a second. `sgdisk -d 2`. The GPT entry disappears. The blocks are still there, the data is still there, but the partition table no longer acknowledges it. Digital amnesia.

`parted resizepart 1 100%`. The partition grows. `e2fsck` runs — clean, exit code 0, no drama. `resize2fs` expands the filesystem to fill the new space. The user relocation fires: `cativo23/` moves to `home/cativo23/`. `rsync` copies root files from the backup. fstab is written — one line for `/`, one for `/boot`, nothing for `/home` because `/home` is just a directory now. `arch-chroot` installs GRUB, generates the config, verifies UUIDs match, regenerates initramfs.

Reboot. Pull the USB. Wait.

```
/dev/nvme1n1p1  469G  104G  342G  24% /
```

Wait. `nvme1n1`?

The disks swapped names *again*. What was `nvme0n1` during the migration is now `nvme1n1` after reboot. The 477G NAND is now `nvme1n1`. The Optane is `nvme0n1`. The kernel, once again, enumerated them in a different order because PCIe bus topology is a suggestion, not a contract. This fucking kernel, I swear.

But it didn't matter. The fstab uses UUIDs. GRUB uses UUIDs. The kernel command line uses UUIDs. Nothing in the boot chain references `/dev/nvme*` by name. The disk can call itself whatever it wants. The UUID doesn't change when the name does.

```
$ df -h /
Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme1n1p1  469G  107G  339G  24% /

$ ls /home/cativo23
Desktop  Documents  Downloads  Music  Pictures  projects  Videos

$ cat /etc/fstab
UUID=259d7476-eecc-4fee-8a70-7bdeb2ee8592  /       ext4  rw,relatime  0 1
UUID=2DC9-9D33 /boot   vfat  rw,relatime,...  0 2
```

One partition. 339 gigs free. No separate /home. No symlink hacks for Docker. No relocating Flatpak. No negotiating with `df -h` every time I install something. The number just goes up, slowly, from one pool, the way it should.

---

## What Changed

The first migration was survival. Root was on a 27-gig Optane drive and it was full. I moved it to a 45-gig partition on the NAND because that was the space available — the rest was /home. It worked. It bought me a month.

The second migration was admitting the first one was a patch, not a fix. Forty-four gigabytes is not enough for a modern Linux root that runs Docker and Flatpak and has opinions about package caching. The correct answer was always one partition, and I spent a month learning that the hard way — watching the usage bar climb, moving things to /home one by one, pretending the two-partition layout made sense for a laptop that belongs to one person.

The technical difference between the two migrations: last time I shrank a partition and created a new one next to it. This time I deleted a partition and grew the surviving one. Last time the data I cared about was untouched. This time my /home was on the partition being resized. The stakes were higher, so the process was slower. Six review rounds instead of one. Two scripts instead of one. A sentinel file to prove the backup finished. A read-only `e2fsck` pass before the real one. A user-directory relocation step that wouldn't have existed if I'd thought harder about mount-point semantics before round five.

The AI difference: last time, the reviews caught five bugs in one round. This time, twenty-four agents across six rounds caught ten bugs — including three that would have destroyed /home or left the system unbootable. The agents disagreed with each other. One thought the e2fsck handling was fine; another traced exit code 2 through the bash error propagation and found it wasn't. One said the rsync excludes were correct; the simulator said they were correct *but the directory layout wouldn't be what you expect*. Parallel review isn't just redundancy — it's adversarial. Different perspectives find different bugs.

But the most important thing I learned is simpler than any of that.

Two partitions on a single-user laptop are a mistake. Not because they fail — they work fine, technically. But they create a capacity-planning problem on a machine that doesn't need capacity planning. You're guessing how much space root needs, and you will guess wrong. You will always guess wrong, because the answer changes every time you install something, and you can't predict what you'll install in six months. One partition eliminates the question. The disk is full when it's full, and until then, everything has room.

I should have done this from the beginning. But if I'd done it from the beginning, I wouldn't have two blog posts, three USB boots, twenty-four review agents, and the knowledge that NVMe device names will betray you every single time.

The fan hums. The terminal glows. I type `df -h` one more time — not to check, just to look at it. 339 gigs free. The number is so large it feels fake, like finding money in a coat pocket. I close the terminal. I should go to bed.

It's not 1am this time. It's only 11. Progress.
