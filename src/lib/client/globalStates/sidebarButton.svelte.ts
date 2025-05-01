const sidebarButton = $state({
  opened: false,
  isPanelPage: false
});

export function toggleOpen(){
  sidebarButton.opened = !sidebarButton.opened;
}

export default sidebarButton as {readonly opened: boolean, isPanelPage: boolean }; 
// just to make sure it's not modified without the toggleOpen function