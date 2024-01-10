<script setup lang="ts">
const props = defineProps({
  themeColor: String
})
</script>

<template>
  <footer class="footer">
    <p>Socials | Contact</p>
    <div class="contact-icons">
      <a href="https://github.com/LiamCavens" :style="{ color: themeColor, '--selectColor': themeColor }" target="_blank">
        <i-grommet-icons-github />
      </a>
      <a
        href="https://www.linkedin.com/in/liamcavens/"
        :style="{ color: themeColor }"
        target="_blank"
      >
        <i-grommet-icons-linkedin />
      </a>
      <a href="mailto:liamcavens@googlemail.com" :style="{ color: themeColor }">
        <i-grommet-icons-mail />
      </a>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  margin-top: auto;
  z-index: 10;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  color: #c7c7c7;
  background-color: #505050;

  p {
    margin: 0;
    font-variant: small-caps;
    .contact-icons {
      margin-top: 10px;

      a {
        font-size: 28px;
        margin: 5px 30px;
        transition: 0.5s all ease-out;

        &:hover {
          transition: 0.5s all ease-in;
          filter: invert(1);
        }
      }
    }
  }

  .contact-icons {
    margin-top: 1rem;
    display: flex;
    gap: 2rem;

    a {
      font-size: 28px;
      transition: 0.5s all ease-out;

      &:hover {
        transition: 0.5s all ease-in;
        filter: invert(1);
      }
    }
  }
}
</style>
