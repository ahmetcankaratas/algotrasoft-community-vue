<template>
  <section id="about-us" class="dark:bg-darkBlue1 relative z-10 flex h-screen bg-gray-50">
    <div
      class="container mx-auto flex flex-col items-center px-6 pt-24 pb-32 md:flex-row md:space-x-16"
    >
      <div class="w-2/3 md:w-1/2">
        <img src="@/assets/images/network.png" alt="" class="mb-10" />
      </div>

      <div class="flex flex-col items-start md:w-1/2">
        <div class="flex flex-col space-y-5">
          <h4 class="max-w-md text-xl font-bold md:text-4xl">About Us</h4>
          <p class="text-md text-justify md:text-lg">
            The Algorithmic Trading Society of Turkey was founded in March 2020 with the aim of
            bringing people together to develop their understanding of the application algorithms in
            a financially driven context.
          </p>

          <p class="text-md text-justify md:text-lg">
            We hope to build a community of Algo traders that can help improve one another.
          </p>
        </div>

        <div class="blok mt-2">
          <a href="/#work" class="border-accentCyan text-accentCyan border-b">
            How We Work
            <img src="@/assets/images/icon-arrow.svg" alt="" class="ml-2 inline pb-1" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>
