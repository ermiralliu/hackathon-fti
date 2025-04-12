<script>
  import Chat from "$lib/components/chat.svelte";
  // diku do te vendoset nje funksion invalidateAll, gje qe do beje reload te dhenat nga databaza, this way
  // ose dicka qe ka te beje me sockets, which listen to the database changes
</script>

<Chat/>