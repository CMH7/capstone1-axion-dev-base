import members from "../sample-members/members";

export default {
  workspaces: [
    {from: "Capstone 1", name: "Papers", color: "danger", isFavorite: true, members: [
      members.members[0],
      members.members[1],
      members.members[2],
      members.members[3],
    ]},
    {from: "Capstone 1", name: "Research & Development", color: "success", isFavorite: false, members: [
      members.members[2],
      members.members[1],
      members.members[3],
      members.members[4],
    ]},
    {from: "Capstone 1", name: "Development", color: "primary", isFavorite: true, members: [
      members.members[5],
      members.members[1],
      members.members[0],
      members.members[3],
      members.members[3],
    ]},
    {from: "Literacy", name: "Data Flow Diagram", color: "warning", isFavorite: false, members: [
      members.members[2],
      members.members[5],
      members.members[1],
      members.members[3],
    ]}
  ]
}