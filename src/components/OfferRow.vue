<template>
  <tr :class="{expired}">
    <td class="left">
      <router-link :to="{name: 'Product', params: {slug: product.slug}}">
        {{ product.name }}
      </router-link>
    </td>
    <td class="date">{{ recentOffer.date }}</td>
  </tr>
</template>

<script>
export default {
  props: {
    product: Object,
  },
  computed: {
    recentOffer() {
      return this.product.offers[0]
    },
    expired() {
      return this.recentOffer.footnotes.length == 0
    },
  },
}
</script>
