const sidebarButton = $state({
  opened: false
});

export function toggleOpen(){
  sidebarButton.opened = !sidebarButton.opened;
}

export default sidebarButton as {readonly opened : boolean }; // just to make sure it's not modified without the toggleOpen function