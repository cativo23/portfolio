<template>
  <div>
    <h2 class="text-3xl font-bold mb-8 text-tokyo-night-cyan">About Me</h2>
    <div class="bg-tokyo-night-dark p-6 rounded-lg">
      <p class="mb-4 text-justify">
        Hi, I'm Carlos Cativo, a passionate backend developer with over 8 years of experience in building scalable and
        efficient server-side applications.
        My expertise lies in designing and implementing high-performance APIs, microservices, and data processing
        systems.
      </p>
      <p class="mb-4 text-justify">
        I'm particularly interested in distributed systems, database optimization, and cloud-native technologies.
        When I'm not coding, I enjoy writing technical blog posts to share my knowledge and experiences with the
        developer community.
      </p>
      <h3 class="text-2xl font-bold mb-4 text-tokyo-night-purple">Skills</h3>
      <ul class="list-disc list-inside mb-4">
        <li>Languages:
          <SkillPill v-for="language in languages" :key="language.name" :name="language.name" :level="language.level" />
        </li>
        <li>Databases:
          <SkillPill v-for="database in databases" :key="database.name" :name="database.name" :level="database.level" />
        </li>
        <li> Message Brokers:
          <SkillPill v-for="broker in brokers" :key="broker.name" :name="broker.name" :level="broker.level" />
        </li>
        <li>Cloud Platforms:
          <SkillPill v-for="platform in platforms" :key="platform.name" :name="platform.name" :level="platform.level" />
        </li>
        <li>DevOps:
          <SkillPill v-for="tool in devOps" :key="tool.name" :name="tool.name" :level="tool.level" />
        </li>
        <li>API Design:
          <SkillPill v-for="api in apis" :key="api.name" :name="api.name" :level="api.level" />
        </li>
      </ul>
      <p>
        I'm always eager to learn new technologies and tackle challenging problems.
        Feel free to reach out if you'd like to collaborate on a project or just chat about backend development!
      </p>
    </div>
  </div>
</template>



<script lang="ts" setup>
import { ref } from 'vue';
import SkillPill from '@/components/about/SkillPill.vue';

usePageTitle('About', {
  description: 'Learn more about Carlos Cativo, a passionate backend developer with expertise in building scalable server-side applications and sharing knowledge through technical blog posts.',
});

const languages = ref([
  { name: 'PHP', level: 'advanced' },
  { name: 'JavaScript', level: 'advanced' },
  { name: 'Python', level: 'intermediate' },
  { name: 'Go', level: 'beginner' },
]);

const databases = ref([
  { name: 'MySQL', level: 'advanced' },
  { name: 'PostgreSQL', level: 'advanced' },
  { name: 'MongoDB', level: 'intermediate' },
  { name: 'Redis', level: 'intermediate' },
]);

const brokers = ref([
  { name: 'Apache Kafka', level: 'advanced' },
  { name: 'RabbitMQ', level: 'intermediate' }
]);

const platforms = [
  { name: 'AWS', level: 'intermediate' },
  { name: 'Google Cloud Platform', level: 'intermediate' }
];

const devOps = [
  { name: 'Docker', level: 'advanced' },
  { name: 'CI/CD pipelines', level: 'intermediate' },
  { name: 'Kubernetes', level: 'beginner' },
];

const apis = [
  { name: 'RESTful APIs', level: 'advanced' },
  { name: 'GraphQL', level: 'beginner' },
];
</script>

<style></style>