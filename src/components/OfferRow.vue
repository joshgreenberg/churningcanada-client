<template>
  <tr :class="{expired: product.expired}">
    <td class="left">
      <router-link :to="{name: 'Product', params: {slug: product.slug}}">
        {{ product.name }}
      </router-link>
    </td>
    <td class="date">{{ product.date }}</td>
  </tr>
</template>

<script>
export default {
  props: {
    product: Object,
  },
}
</script>
