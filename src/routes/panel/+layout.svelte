<script lang="ts">
  import { page } from "$app/state";
  import PanelAside from "$lib/components/panelAside.svelte";
  import { onMount, type Snippet } from "svelte";

  let {children}: {children: Snippet} = $props();
  
  const tabs = [
    { id: "add", label: "Add Product", route: "/panel/add" },
    { id: "view", label: "View Products", route: "/panel/view" },
    {
      id: "notifications",
      label: "Notifications",
      route: "/panel/notifications",
    },
    { id: "messages", label: "Messages", route: "/panel/messages" },
  ];
  
  let activeTab = $derived((() => {
    const paths = page.url.pathname.split("/");
    const temp = paths[paths.length - 1];
    return temp;
  })());
  
  import sidebarButton, {toggleOpen} from "$lib/client/globalStates/sidebarButton.svelte";
  
  onMount(()=>{
    sidebarButton.isPanelPage = true;
    return ()=>{
      sidebarButton.isPanelPage = false;
      if(sidebarButton.opened)
        toggleOpen();
    }
  });

</script>

<PanelAside {tabs} {activeTab}>
  {@render children()}
</PanelAside>
