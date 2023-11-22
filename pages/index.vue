<script setup lang="ts">
const user = useSupabaseUser()
const { auth } = useSupabaseClient()

const redirectTo = `${useRuntimeConfig().public.baseUrl}/confirm`

watchEffect(() => {
    console.log(user)
  if (user.value) {
    navigateTo('/tasks')
  }
})
</script>

<template>
  <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <h2 class="my-6 text-center text-3xl font-extrabold u-text-white">
      Sign in to your account
    </h2>
    <LoginCard>
      <UButton
        class="mt-3"
        icon="i-mdi-google"
        block
        label="Google"
        variant="black"
        @click="auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })"
      />
    </LoginCard>
  </div>
</template>
