<template>
    <motion tag="span" :class="['inline-block whitespace-pre-wrap', containerClass, 'transition-all duration-500']"
        v-on="hoverProps" :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
        :whileHover="{ scale: 1.05 }">
        <span ref="containerRef">
            <span class="sr-only">{{ displayText }}</span>
            <span aria-hidden="true">
                <span v-for="(char, index) in displayText.split('')" :key="index" :class="[
                    revealedIndices.has(index)
                        ? (props.class || '')
                        : (encryptedClassName ? encryptedClassName : 'text-gray-400 dark:text-gray-600 opacity-60'),
                    'inline-block transition-all duration-300',
                ]">
                    {{ char }}
                </span>
            </span>
        </span>
    </motion>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed, nextTick, type Ref } from 'vue'

const props = defineProps({
    text: { type: String, required: true },
    speed: { type: Number, default: 50 },
    maxIterations: { type: Number, default: 10 },
    sequential: { type: Boolean, default: false },
    revealDirection: { type: String, default: 'start' },
    useOriginalCharsOnly: { type: Boolean, default: false },
    characters: { type: String, default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+' },
    class: { type: String, default: '' }, // Use 'class' instead of 'className'
    containerClass: { type: String, default: '' },
    encryptedClassName: { type: String, default: '' },
    animateOn: { type: String, default: 'hover' },
})

const displayText = ref('')

const isHovering = ref(false)
const isScrambling = ref(false)
const revealedIndices = ref<Set<number>>(new Set())
const hasAnimated = ref(false)
const containerRef: Ref<HTMLElement | null> = ref(null)
let interval: ReturnType<typeof setInterval> | null = null
let currentIteration = 0

const getNextIndex = (revealedSet: Set<number>) => {
    const textLength = props.text.length
    switch (props.revealDirection) {
        case 'start':
            return revealedSet.size
        case 'end':
            return textLength - 1 - revealedSet.size
        case 'center': {
            const middle = Math.floor(textLength / 2)
            const offset = Math.floor(revealedSet.size / 2)
            const nextIndex =
                revealedSet.size % 2 === 0
                    ? middle + offset
                    : middle - offset - 1
            if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
                return nextIndex
            }
            for (let i = 0; i < textLength; i++) {
                if (!revealedSet.has(i)) return i
            }
            return 0
        }
        default:
            return revealedSet.size
    }
}

const availableChars = computed(() =>
    props.useOriginalCharsOnly
        ? Array.from(new Set(props.text.split(''))).filter((char) => char !== ' ')
        : props.characters.split('')
)

const shuffleText = (originalText: string, currentRevealed: Set<number>) => {
    if (props.useOriginalCharsOnly) {
        const positions = originalText.split('').map((char, i) => ({
            char,
            isSpace: char === ' ',
            index: i,
            isRevealed: currentRevealed.has(i),
        }))
        const nonSpaceChars = positions
            .filter((p) => !p.isSpace && !p.isRevealed)
            .map((p) => p.char)
        for (let i = nonSpaceChars.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]]
        }
        let charIndex = 0
        return positions
            .map((p) => {
                if (p.isSpace) return ' '
                if (p.isRevealed) return originalText[p.index]
                return nonSpaceChars[charIndex++]
            })
            .join('')
    } else {
        return originalText
            .split('')
            .map((char, i) => {
                if (char === ' ') return ' '
                if (currentRevealed.has(i)) return originalText[i]
                return availableChars.value[Math.floor(Math.random() * availableChars.value.length)]
            })
            .join('')
    }
}

// In startScrambling, always reset revealedIndices for a fresh animation
const startScrambling = () => {
    isScrambling.value = true
    currentIteration = 0
    revealedIndices.value = new Set()
    displayText.value = shuffleText(props.text, revealedIndices.value)
    if (interval) clearInterval(interval)
    interval = setInterval(() => {
        revealedIndices.value = new Set(revealedIndices.value)
        if (props.sequential) {
            if (revealedIndices.value.size < props.text.length) {
                const nextIndex = getNextIndex(revealedIndices.value)
                revealedIndices.value.add(nextIndex)
                displayText.value = shuffleText(props.text, revealedIndices.value)
            } else {
                if (interval) clearInterval(interval)
                isScrambling.value = false
            }
        } else {
            displayText.value = shuffleText(props.text, revealedIndices.value)
            currentIteration++
            if (currentIteration >= props.maxIterations) {
                if (interval) clearInterval(interval)
                isScrambling.value = false
                displayText.value = props.text
                // FIX: Mark all indices as revealed after scrambling
                revealedIndices.value = new Set(Array.from({ length: props.text.length }, (_, i) => i))
            }
        }
    }, props.speed)
}

const stopScrambling = () => {
    if (interval) clearInterval(interval)
    displayText.value = props.text
    revealedIndices.value = new Set()
    isScrambling.value = false
}

watch(
    () => [props.text, props.speed, props.maxIterations, props.sequential, props.revealDirection, props.characters, props.useOriginalCharsOnly],
    () => {
        stopScrambling()
        displayText.value = props.text
    }
)

watch(isHovering, (val) => {
    if (val) {
        startScrambling()
    } else {
        stopScrambling()
    }
})

let observer: IntersectionObserver | null = null
// --- IntersectionObserver for animateOn='view' ---
onMounted(async () => {
    if (props.animateOn === 'view') {
        displayText.value = shuffleText(props.text, new Set())

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !hasAnimated.value) {
                    hasAnimated.value = true
                    revealedIndices.value = new Set()
                    currentIteration = 0
                    startScrambling()
                }
            })
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        }

        observer = new window.IntersectionObserver(observerCallback, observerOptions)
        await nextTick()
        if (containerRef.value instanceof Element) {
            observer.observe(containerRef.value)

            if (containerRef.value.getBoundingClientRect().top < window.innerHeight) {
                hasAnimated.value = true
                revealedIndices.value = new Set()
                currentIteration = 0
                startScrambling()
            }
        }
    } else if (props.animateOn === 'hover') {
        displayText.value = shuffleText(props.text, new Set())
    }
})


onBeforeUnmount(() => {
    if (observer && containerRef.value instanceof Element) {
        observer.unobserve(containerRef.value)
    }
    if (interval) clearInterval(interval)
})

const hoverProps = computed(() =>
    props.animateOn === 'hover'
        ? {
            mouseenter: () => (isHovering.value = true),
            mouseleave: () => (isHovering.value = false),
        }
        : {}
)

</script>
