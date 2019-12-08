<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <pre>
      {{ JSON.stringify(projects) }}
    </pre>
  </div>
</template>

<script>
import { actions, selector } from '@/store/modules/projects';

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  computed: {
    ...selector
  },
  methods: {
    ...actions
  },
  mounted() {
    this.fetch();
  },
  beforeDestroy() {
    this.cancel();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
