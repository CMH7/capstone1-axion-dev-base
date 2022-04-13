import members from "$lib/sample-case/sample-members/members";

export default {
  tasks: [
    {
      from: "Papers",
      name: "Introduction",
      level: "L", isFavorite: true,
      status: "Todo",
      allMembers: [
        members.members[0],
        members.members[1],
        members.members[4]
      ],
      duedate: "04-18-2022",
      subtasks: [
        {
          name: "subtask1",
          allMembers: [
            members.members[0]
          ],
          done: false,
          subtasks: []
        },
        {
          name: "subtask2",
          allMembers: [
            members.members[0]
          ],
          done: false,
          subtasks: []
        }
      ]
    },
    {
      from: "Development",
      name: "Start UI",
      level: "M",
      isFavorite: true,
      status: "In progress",
      allMembers: [
        members.members[1],
        members.members[0],
        members.members[3]
      ],
      duedate: "04-25-2022",
      subtasks: [
        {
          name: "subtask11",
          allMembers: [
            members.members[0]
          ],
          done: false,
          subtasks: []
        },
        {
          name: "subtask12",
          allMembers: [
            members.members[0]
          ],
          done: false,
          subtasks: []
        },
        {
          name: "subtask13",
          allMembers: [
            members.members[0]
          ],
          done: false,
          subtasks: []
        },
        {
          name: "subtask14",
          allMembers: [
            members.members[0]
          ],
          done: false,
          subtasks: []
        }
      ]
    },
    {
      from: "Research & Development",
      name: "Review of related studies",
      level: "H",
      isFavorite: false,
      status: "Todo",
      allMembers: [
        members.members[0],
        members.members[1]
      ],
      duedate: "04-20-2022",
      subtasks: [
        {
          name: "subtask21",
          allMembers: [
            members.members[0]
          ],
          done: false,
          subtasks: []
        },
        {
          name: "subtask22",
          allMembers: [
            members.members[0]
          ],
          done: false,
          subtasks: []
        }
      ]
    },
    {
      from: "Data Flow Diagram",
      name: "Stored Data",
      level: "M",
      isFavorite: false,
      status: "Done",
      allMembers: [
        members.members[4],
        members.members[2],
        members.members[1],
        members.members[0],
        members.members[3]
      ],
      duedate: "05-25-2022",
      subtasks: [],
    }
  ]
}