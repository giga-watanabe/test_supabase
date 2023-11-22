<script setup lang="ts">
import type { Database } from '~~/types/database.types'

const client = useSupabaseClient<Database>()
const user = useSupabaseUser()

const tasksFromServer = ref()
const isModalOpen = ref(false)
const loading = ref(false)
const newTask = ref('')

const { data: tasks } = await useAsyncData('testdatabase', async () => {
  const { data } = await client.from('testdatabase').select('id, title, completed').order('created_at')

  return data
})

async function addTask () {
  if (newTask.value.trim().length === 0) { return }

  loading.value = true

  const taskId :number = newTask.value.slice(4)

  const { data } = await client.from('testdatabase')
    .upsert({
      id: taskId,
      title: newTask.value,
      completed: false
    })
    .select('id, title, completed')
    .single()

  tasks.value.push(data)
  newTask.value = ''
  loading.value = false
}

const completeTask = async (task: Task) => {
  await client.from('testdatabase').update({ completed: task.completed }).match({ id: task.id })
}

const removeTask = async (task: Task) => {
  tasks.value = tasks.value.filter(t => t.id !== task.id)
  await client.from('testdatabase').delete().match({ id: task.id })
}

const fetchTasksFromServerRoute = async () => {
  const { data } = await useFetch('/api/tasks', { headers: useRequestHeaders(['cookie']), key: 'tasks-from-server' })

  tasksFromServer.value = data
  isModalOpen.value = true
}

</script>

<template>
  <div class="w-full my-[50px]">
    <h1 class="mb-12 text-6xl font-bold u-text-white">
      Todo List.
    </h1>
    <form
      class="flex gap-2 my-2"
      @submit.prevent="addTask"
    >
      <UInput
        v-model="newTask"
        :loading="loading"
        class="w-full"
        size="xl"
        variant="white"
        type="text"
        name="newTask"
        placeholder="Make a coffee"
        autofocus
        autocomplete="off"
      />
      <UButton
        type="submit"
        variant="white"
      >
        Add
      </UButton>
    </form>
    <UCard
      v-if="tasks?.length > 0"
      body-class="px-6 py-2 overflow-hidden"
    >
      <ul>
        <li
          v-for="task of tasks"
          :key="task.id"
          class="border-b border-gray-200 divide-y divide-gray-200"
        >
          <div class="py-2">
            <UFormGroup
              :label-class="`block font-medium ${task.completed ? 'line-through u-text-gray-500' : 'u-text-gray-700'}`"
              :label="task.title"
              :name="String(task.id)"
              wrapper-class="flex items-center justify-between w-full"
            >
              <div class="flex items-center justify-between">
                <div @click="completeTask(task)">
                  <UToggle
                    v-model="task.completed"
                    :name="String(task.id)"
                    icon-off="heroicons-solid:x"
                    icon-on="heroicons-solid:check"
                  />
                </div>
                <UButton
                  class="ml-3 text-red-600"
                  size="sm"
                  variant="transparent"
                  icon="i-heroicons-outline-trash"
                  @click="removeTask(task)"
                />
              </div>
            </UFormGroup>
          </div>
        </li>
      </ul>
    </UCard>
  </div>
</template>

<style lang="postcss">
ul > li:last-child {
  @apply border-b-0;
}
</style>
