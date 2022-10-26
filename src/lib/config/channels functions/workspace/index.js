import board from "./board";
import onAdminRemoved from "./onAdminRemoved";
import onMemberLeave from "./onMemberLeave";
import onMemberRemoved from "./onMemberRemoved";
import onNewAdmin from "./onNewAdmin";
import onOwnerDelete from "./onOwnerDelete";

export default {
  onDelete: onOwnerDelete.onWorkspaceDelete,
  adminRemoved: onAdminRemoved.adminRemove,
  onNewAdmin: onNewAdmin.onNewAdmin,
  onMemberRemoved: onMemberRemoved.onMemberRemoved,
  onMemberLeave: onMemberLeave.onMemberLeave,
  // #### maaga na daw pasukan ####
  newBoard: board.newBoard
}