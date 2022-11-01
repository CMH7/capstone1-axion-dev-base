<script>
  // @ts-nocheck
  import { Ripple, Dialog, Icon, Avatar, ClickOutside, Checkbox, Button, TextField, MaterialApp} from "svelte-materialify"
  import { taskViewModalActive, chats, notifs, taskCurTab, allBoards, activeTask, activeWorkspace, userData, activeSubject, activeBoard, currentInterface, isProcessing } from '$lib/stores/global-store'
  import { mdiPencil, mdiChat, mdiClose, mdiDotsVertical, mdiEyeOutline, mdiFilter, mdiMenu, mdiPlus, mdiSend, mdiStar, mdiStarOutline, mdiText, mdiTrashCan, mdiViewList, mdiCheck } from "@mdi/js"
  import SvelteMarkdown from 'svelte-markdown'
  import constants from "$lib/config/constants"
  import bcrypt from "bcryptjs"
	import { favorites } from "$lib/stores/favorites";
	import { taskDeleteModalActive, taskName, taskRenameActiveModal } from "$lib/stores/taskStore";
  import { Pulse } from 'svelte-loading-spinners'
	import ViewDp from "$lib/components/modals/viewDP.svelte";
	import { currentDP, viewDPModalActive } from "$lib/stores/myProfile";

  const backURI = constants.backURI

  let outerWidth = 0
  let drop = false
  let drop1 = false
  let editing = false
  let chatInput = ''
  let assigneeInputValue = ''
  let viewersModalActive = false
  let descriptionValue = ''
  let activeTaskMembers = []
  let searchingMember = false
  let removingMember = false
  let chatInputDisable = false
  let taskNameLocal = $activeTask.name
  let taskNameEditing = false
  let chatContainer
  let selectedWorkspaceMembers = []
  let leftView = false
  $: oldDescriptionValue = descriptionValue
  
  activeTask.subscribe(task => {
    descriptionValue = task.description
    chats.set(task.conversations)
    activeTaskMembers = task.members
  })
  
  let workspaceMembersCopy = $activeWorkspace.members
  function filterMembers() {
    if(assigneeInputValue === '') {
      workspaceMembersCopy = $activeWorkspace.members
    }
    workspaceMembersCopy = $activeWorkspace.members.filter(member => {
      if(member.name.toLowerCase().split(' ').join('').match(assigneeInputValue.split(' ').join('').toLowerCase()) || member.email.toLowerCase().match(assigneeInputValue.split(' ').join('').toLowerCase())) {
        return member
      }
    })
  }

  const removeMember = (member) => {
    isProcessing.set(true)

    fetch(`${backURI}/MainApp/dashboard/subject/workspace/board/task/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          user: $userData.id,
          subject: $activeSubject.id,
          workspace: $activeWorkspace.id,
          board: $activeBoard,
          task: $activeTask.id
        },
        task: {
          name: $activeTask.name,
          status: $activeTask.status,
          level: $activeTask.level,
          description: $activeTask.description,
          members: [member]
        },
        mode: 'memberRemove'
      })
    }).then(async res => {
      const { task } = await res.json()

      let userDataCopy = $userData
      userDataCopy.subjects.every(subject => {
        if(subject.id === $activeSubject.id) {
          subject.workspaces.every(workspace => {
            if(workspace.id === $activeWorkspace.id) {
              workspace.boards.every(board => {
                if(board.id === $activeBoard) {
                  board.tasks.every(taska => {
                    if(taska.id === $activeTask.id) {
                      taska.members = taska.members.filter(member => member.id !== task.members[0].id)
                      activeTask.set(taska)
                      return false
                    }
                   return true
                  })
                  return false
                }
                return true
              })
              activeWorkspace.set(workspace)
              return false
            }
            return true
          })
          activeSubject.set(subject)
          return false
        }
        return true
      })
      userData.set(userDataCopy)

      $notifs = [...$notifs, {
        msg: `${member.name} is removed as assignee to task \'${$activeTask.name}\'`,
        type: 'success',
        id: `${Math.random() * 99}${new Date().getTime()}`
      }]

    }).catch(err => {
      $notifs = [...$notifs, {
        msg: `Error in removing assignment of member, ${err}`,
        type: 'error',
        id: `${Math.random() * 99}${new Date().getTime()}`
      }]
    }).finally(() => {
      isProcessing.set(false)
    })
  }

  function insertChat() {
    chatInputDisable = true
    if(!chatInput) {
      $notifs = [...$notifs, {
        msg: 'Message cannot be empty',
        type: 'error',
        id: `${Math.random() * 99}${new Date().getTime()}`
      }]
      chatInputDisable = false
      return false
    }

    const today = new Date()
    const sendAt = new Date(`${today.getFullYear()}-${today.getMonth() + 1 <= 9 ? `0${today.getMonth() + 1}`: today.getMonth() + 1}-${today.getDate() <= 9 ? `0${today.getDate()}`: today.getDate()}T${today.getHours() <= 9 ? `0${today.getHours()}` : today.getHours()}:${today.getMinutes() <= 9 ? `0${today.getMinutes()}` : today.getMinutes()}:00Z`).toISOString()

    fetch(`${constants.backURI}/MainApp/dashboard/subject/workspace/board/task/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          user: $userData.id,
          subject: $activeSubject.id,
          workspace: $activeWorkspace.id,
          board: $activeBoard,
          task: $activeTask.id
        },
        chat: {
          sender: {
            email: $userData.email,
            name: `${$userData.firstName} ${$userData.lastName}`,
            profile: $userData.profile,
            id: $userData.id
          },
          message: chatInput,
          sendAt,
          id: bcrypt.hashSync(`${$userData.email}${new Date()}${chatInput.length <= 13 ? chatInput : chatInput.substring(0, 12)}`)
        }
      })
    }).then(async res => {
      const { chat } = await res.json()
      let userDataCopy = $userData
      userDataCopy.subjects.every(subject => {
        if(subject.id === $activeSubject.id) {
          subject.workspaces.every(workspace => {
            if(workspace.id === $activeWorkspace.id) {
              workspace.boards.every(board => {
                if(board.id === $activeBoard) {
                  board.tasks.every(task => {
                    if(task.id === $activeTask.id) {
                      task.conversations.push(chat)
                      activeTask.set(task)
                      return false
                    }
                    return true
                  })
                  return false
                }
                return true
              })
              return false
            }
            return true
          })
          return false
        }
        return true
      })
      chatInputDisable = false
    }).catch(err => {
      $notifs = [...$notifs, {
        msg: `Error in sending a chat, ${err}`,
        type: 'error',
        id: `${Math.random() * 99}${new Date().getTime()}`
      }]
      chatInputDisable = false
    }).finally(() => {
      chatInput = ''
      chatContainer.scrollTop = chatContainer.scrollHeight
    })
  }

  function onKeyDownHandler(e) {
    if(!$isProcessing) {
      if(e.keyCode == 13 && $taskCurTab === 'Chats' && !taskNameEditing && !searchingMember) {
        console.log(taskNameEditing);
        if(!chatInput) {
          $notifs = [...$notifs, {
            msg: 'Message cannot be empty',
            type: 'error',
            id: `${Math.random() * 99}${new Date().getTime()}`
          }]
        }else{
          insertChat()
        }
      }
      
      if(e.ctrlKey && e.keyCode == 13 && $taskCurTab === 'Description' && !taskNameEditing && !searchingMember) {
        descriptionSave(descriptionValue != oldDescriptionValue)
      }else if(e.keyCode == 27  && $taskCurTab === 'Description' && editing && !taskNameEditing && !searchingMember) {
        descriptionSave(false)
      }
  
      if(e.keyCode == 13 && taskNameEditing && !searchingMember) {
        taskRename()
        taskNameEditing = false
      }
    }
  }

  function descriptionSave(save) {
    if(save) {
      isProcessing.set(true)

      fetch(`${constants.backURI}/MainApp/dashboard/subject/workspace/board/task/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ids: {
            user: $userData.id,
            subject: $activeSubject.id,
            workspace: $activeWorkspace.id,
            board: $activeBoard,
            task: $activeTask.id
          },
          task: {
            name: $activeTask.name,
            description: descriptionValue,
            members: [],
            status: $activeTask.status,
            level: $activeTask.level
          },
          mode: 'description'
        })
      }).then(async res => {
        const { task } = await res.json()
        let userDataCopy = $userData
        userDataCopy.subjects.every(subject => {
          if(subject.id === $activeSubject.id) {
            subject.workspaces.every(workspace => {
              if(workspace.id === $activeWorkspace.id) {
                workspace.boards.every(board => {
                  if(board.id === $activeBoard) {
                    board.tasks.every(taska => {
                      if(taska.id === $activeTask.id) {
                        taska.description = task.description
                        activeTask.set(taska)
                      }
                      return true
                    })
                    return false
                  }
                  return true
                })
                return false
              }
              return true
            })
            return false
          }
          return true
        })
        $notifs = [...$notifs, {
          msg: 'Task description updated',
          type: 'success',
          id: `${Math.random() * 99}${new Date().getTime()}`
        }]
        oldDescriptionValue = descriptionValue
      }).catch(err => {
        $notifs = [...$notifs, {
          msg: `Error in updating task description to ${$taskName}, ${err}`,
          type: 'error',
          id: `${Math.random() * 99}${new Date().getTime()}`
        }]
      }).finally(() => {
        editing = false
        isProcessing.set(false)
      })
    }else {
      descriptionValue = oldDescriptionValue
      editing = false
    }
  }

  function descKeydownHandler(e) {
    if($taskViewModalActive && $taskCurTab === 'Description' && !taskNameEditing && !$isProcessing) {
      if(e.key === 'Escape') {
        descriptionSave(false)
      }else if(e.ctrlKey && e.keyCode == 13 && !taskNameEditing && $taskViewModalActive && $taskCurTab === 'Description' && !$isProcessing) {
        descriptionSave(true)
      }
    }
  }

  const updateStatus = async boardName => {
    isProcessing.set(true)

    fetch(`${backURI}/MainApp/dashboard/subject/workspace/board/task/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          user: $userData.id,
          subject: $activeSubject.id,
          workspace: $activeWorkspace.id,
          board: $activeBoard,
          task: $activeTask.id
        },
        task: {
          name: $activeTask.name,
          level: $activeTask.level,
          members: [],
          description: $activeTask.description,
          status: boardName
        },
        mode: 'status'
      })
    }).then(async res => {
      const { task } = await res.json()

      let activeTaskCopy = $activeTask
      activeTaskCopy.status = task.status
      activeTask.set(activeTaskCopy)

      let userDataCopy = $userData
      userDataCopy.subjects.every(subject => {
        if(subject.id === $activeSubject.id) {
          subject.workspaces.every(workspace => {
            if(workspace.id === $activeWorkspace.id) {
              workspace.boards.every(board => {
                if(board.id === $activeBoard) {
                  // Remove the task in the old board
                  board.tasks = board.tasks.filter(task => task.id !== $activeTask.id)

                  // Add the task in the new board based on the boardName or task.status
                  workspace.boards.every(boarda => {
                    if(boarda.name === task.status) {
                      boarda.tasks.push($activeTask)
                      return false
                    }
                    return true
                  })
                  return false
                }
                return true
              })
              activeWorkspace.set(workspace)
              $allBoards = workspace.boards
              return false
            }
            return true
          })
          activeSubject.set(subject)
          return false
        }
        return true
      })
      userData.set(userDataCopy)

      if($currentInterface === 'Favorites') {
        $favorites = []
        $userData.subjects.map(subject => {
          subject.workspaces.map(workspace => {
            workspace.boards.map(board => {
              $favorites = [...$favorites, ...board.tasks.filter(task => task.isFavorite == true).map(data => {
                return {
                  boardID: board.id,
                  task: data
                }
              })]
            })
          })
        })
      }

      $notifs = [...$notifs, {
        msg: `${task.name} is moved to ${boardName}`,
        type: 'success',
        id: `${Math.random() * 99}${new Date().getTime()}`
      }]
    }).catch(err => {
      $notifs = [...$notifs, {
        msg: `Error in updating the task status, ${err}`,
        type: 'error',
        id: `${Math.random() * 99}${new Date().getTime()}`
      }]
    }).finally(() => isProcessing.set(false))
  }

  $: month = parseInt($activeTask.dueDateTime.split('T')[0].split('-')[1])
  $: hour = parseInt($activeTask.dueDateTime.split('T')[1].split('-')[0])

  const setFavorite = e => {
    if($currentInterface === 'Favorites') {
      $userData.subjects.every(subject => {
        subject.workspaces.every(workspace => {
          workspace.boards.every(board => {
            board.tasks.every(task => {
              if(task.id === $activeTask.id) {
                activeSubject.set(subject)
                activeWorkspace.set(workspace)
                return false
              }
              return true
            })
            return true
          })
          return true
        })
        return true
      })
    }

    fetch(`${constants.backURI}/MainApp/subject/workspace/board/task/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          user: $userData.id,
          subject: $activeSubject.id,
          workspace: $activeWorkspace.id,
          board: $activeBoard
        },
        task: {
          id: $activeTask.id,
          name: $activeTask.name,
          isFavorite: $activeTask.isFavorite ? false : true,
          level: $activeTask.level
        }
      })
    }).then(async res => {
      const {error, task} = await res.json()
      if(error) {
        $notifs = [...$notifs, {
          msg: 'Response received but error in updating task',
          type: 'error',
          id: `${Math.random() * 99}${new Date().getTime()}`
        }]
        return 
      }

      $notifs = [...$notifs, {
        msg: `${$activeTask.name} is ${task.isFavorite ? 'marked as': 'removed from'} favorites`,
        type: 'success',
        id: `${Math.random() * 99}${new Date().getTime()}`
      }]

      let userDataCopy = $userData
      userDataCopy.subjects.every(subject => {
        if(subject.id === $activeSubject.id) {
          subject.workspaces.every(workspace => {
            if(workspace.id === $activeWorkspace.id) {
              workspace.boards.every(board => {
                if(board.id === $activeBoard) {
                  board.tasks.every(taska => {
                    if(taska.id === $activeTask.id) {
                      taska.name = task.name
                      taska.isFavorite = task.isFavorite
                      taska.level = task.level
                      activeTask.set(taska)
                      activeWorkspace.set(workspace)
                      activeSubject.set(subject)
                      return false
                    }
                    return true
                  })
                  return false
                }
                return true
              })
              return false
            }
            return true
          })
          return false
        }
        return true
      })
      userData.set(userDataCopy)

      if($currentInterface === 'Favorites' && !$activeTask.isFavorite) {
        taskViewModalActive.set(false)
        activeTask.set(constants.task)
      }

      if($currentInterface !== 'Dashboard') {
        $favorites = []
        $userData.subjects.map(subject => {
          subject.workspaces.map(workspace => {
            workspace.boards.map(board => {
              $favorites = [...$favorites, ...board.tasks.filter(task => task.isFavorite == true).map(data => {
                return {
                  boardID: board.id,
                  task: data
                }
              })]
            })
          })
        })
      }

    }).catch(err => {
      $notifs = [...$notifs, {
        msg: `Error in marking as favorite task, ${err}`,
        type: 'error',
        id: `${Math.random() * 99}${new Date().getTime()}`
      }]
      console.error(err)
    })
  }

  const taskRename = () => {
    if(taskNameLocal === '' || taskNameLocal === $activeTask.name) {
      $notifs = [...$notifs, {
        msg: `Task name cannot be empty or same old name`,
        type: 'error',
        id: `${Math.random() * 99}${new Date().getTime()}`
      }]
      return
    }

    taskName.set(taskNameLocal)
    taskRenameActiveModal.set(true)
    taskViewModalActive.set(false)
  }

  const assigneeUpdated = () => {
    if(selectedWorkspaceMembers.length == 0) {
      drop = false
    } else {
      isProcessing.set(true)
      fetch(`${backURI}/MainApp/dashboard/subject/workspace/board/task/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ids: {
            user: $userData.id,
            subject: $activeSubject.id,
            workspace: $activeWorkspace.id,
            board: $activeBoard,
            task: $activeTask.id
          },
          task: {
            name: $activeTask.name,
            status: $activeTask.status,
            level: $activeTask.level,
            description: $activeTask.description,
            members: selectedWorkspaceMembers
          },
          mode: 'members'
        })
      }).then(async res => {
        const { task } = await res.json()
        let userDataCopy = $userData
        userDataCopy.subjects.every(subject => {
          if(subject.id === $activeSubject.id) {
            subject.workspaces.every(workspace => {
              if(workspace.id === $activeWorkspace.id) {
                workspace.boards.every(board => {
                  if(board.id === $activeBoard) {
                    board.tasks.every(taska => {
                      if(taska.id === $activeTask.id) {
                        taska.members = [...taska.members, ...task.members]
                        activeTask.set(taska)
                        return false
                      }
                      return true
                    })
                    return false
                  }
                  return true
                })
                activeWorkspace.set(workspace)
                $allBoards = workspace.boards
                return false
              }
              return true
            })
            activeSubject.set(subject)
            return false
          }
          return true
        })
        $notifs = [...$notifs, {
          msg: `Added new assignee into task \'${$activeTask.name}\'`,
          type: 'success',
          id: `${Math.random() * 99}${new Date().getTime()}`
        }]
      }).catch(err => {
        $notifs = [...$notifs, {
          msg: `Error in updating task assignees, ${err}`,
          type: 'stayError',
          id: `${Math.random() * 99}${new Date().getTime()}`
        }]
      }).finally(() => {
        selectedWorkspaceMembers = []
        isProcessing.set(false)
        drop = false
      })
    }
  }

  const goTo = e => {
    currentInterface.set('Dashboard')
    currentIndex.set(0)
    currentDashboardSubInterface.set('Boards')
    breadCrumbsItems.set([{text: $activeSubject.name}, {text: $activeWorkspace.name}, {text: 'boards'}])
  }
</script>

<svelte:window bind:outerWidth on:keydown={onKeyDownHandler}/>

<MaterialApp>
  <div class="p-3 has-background-white-bis is-flex maxmins-w-100p">
    <!-- Container -->
    <div class="is-flex maxmins-h-500 maxmins-w-100p">
      <!-- ##### RIGHT SIDE ##### -->
      <div class="{leftView ? 'undisp' : ''} maxmins-w-{outerWidth < 571 ? '100': '65'}p">
        {#if $isProcessing}
        <div class="maxmins-w-100p maxmins-h-100p is-flex is-justify-content-center is-align-items-center">
          <Pulse size={20} color='#191a48' />
        </div>
        {:else}
        <div class="is-flex is-flex-wrap-wrap">
          <!-- task name, favorite, level -->
          <div class="{outerWidth < 571 ? 'min-w-100p': 'pl-3'} ">
            <div class="is-flex {outerWidth < 571 ? 'is-justify-content-space-between': 'is-align-items-center'}">
              <div class="is-flex is-align-items-center max-w-50p">
                {#if !taskNameEditing}
                  <!-- task name -->
                  <div class="fredoka-reg txt-size-32 is-size-4-mobile txt-color-yaz-grey-dark {outerWidth < 571 ? 'max-w-80p' : ''} overflow-x-auto txt-overflow-nowrap-only">
                    {$activeTask.name}
                  </div>
                {:else}
                  <TextField bind:value={taskNameLocal} dense color='#a0a0a0' outlined>{$activeTask.name}</TextField>
                {/if}
  
                <div 
                  on:click={e => {
                    if(taskNameEditing) {
                      taskRename()
                      taskNameEditing = false
                      return
                    }
                    if(!taskNameEditing) {
                      taskNameEditing = true
                    }
                  }}
                  class="is-clickable ml-2"
                >
                  {#if !taskNameEditing}
                    <Icon size='15px' path={mdiPencil} />
                  {:else}
                    <Icon size='18px' path={mdiCheck} />
                  {/if}
                </div>
              </div>
  
              <!-- Utilities / tools -->
              <div class="{outerWidth > 571 ? 'ml-3': ''} is-flex">
                <!-- favorite icon -->
                <div
                  on:click={setFavorite}
                  class="is-flex-shrink-0 is-clickable mr-3">
                  {#if $activeTask.isFavorite}
                  <Avatar tile size='25px' style="max-width: 25px">
                    <Icon size=25 class='has-text-{$activeTask.color === 'warning' ? '' : 'warning'}' path={mdiStar} />
                  </Avatar>
                  {:else}
                  <Avatar tile size='25px' style="max-width: 25px">
                    <Icon size=25 class='has-text-{$activeTask.color === 'warning' ? '' : 'warning'}' path={mdiStarOutline} />
                  </Avatar>
                  {/if}
                </div>
  
  
                <!-- level -->
                <div class="is-flex-shrink-0">
                  <Avatar tile size='25px' style="max-width: 25px" class="is-unselectable dmsans has-text-weight-bold bg-color-yaz-{$activeTask.level == 1 ? 'green': $activeTask.level == 2 ? 'yellow': 'red'} has-text-white fredoka-reg rounded is-clickable mr-2">
                    {$activeTask.level == 1 ? 'L': $activeTask.level == 2 ? 'M': 'H'}
                  </Avatar>
                </div>
                
                <!-- tablet menu icon -->
                <div
                  on:click={e => leftView = true}
                  class="{outerWidth > 570 ? 'undisp': ''} is-clickable"
                >
                  <Avatar tile size='25px' style="max-width: 25px" class="mr-2">
                    <Icon path={mdiMenu} />
                  </Avatar>
                </div>
                
                <!-- tablet Close icon -->
                <div
                  on:click={() => taskViewModalActive.set(false)}
                  class="{outerWidth > 571 ? 'undisp': ''} is-clickable"
                >
                  <Avatar tile size='25px' style="max-width: 25px" class="is-unselectable dmsans has-text-weight-bold bg-color-yaz-red has-text-white fredoka-reg rounded is-clickable">
                    <Icon path={mdiClose} />
                  </Avatar>
                </div>
  
              </div>
            </div>
          </div>
  
          <!-- due date and created by -->
          <div class="pl-3 min-w-100p">
            <!-- due date -->
            <div class="fredoka-reg is-size-7 opacity-60p">
              Due: {`${month == 1 ? 'Jan' : month == 2 ? 'Feb' : month == 3 ? 'Mar' : month == 4 ? 'Apr' : month == 5 ? 'May' : month == 6 ? 'Jun' : month == 7 ? 'Jul' : month == 8 ? 'Aug' : month == 9 ? 'Sep' : month == 10 ? 'Oct' : month == 11 ? 'Nov' : month == 12 ? 'Dec' : ''} ${$activeTask.dueDateTime.split('T')[0].split('-')[2]}, ${$activeTask.dueDateTime.split('T')[0].split('-')[0]} ${hour == 13 ? '01' : hour == 14 ? '02' : hour == 15 ? '03' : hour == 16 ? '04' : hour == 17 ? '05' : hour == 18 ? '06' : hour == 19 ? '07' : hour == 20 ? '08' : hour == 21 ? '09' : hour == 22 ? '10' : hour == 23 ? '11' : hour == 24 || hour == 0 ? '12' : hour}:${$activeTask.dueDateTime.split('T')[1].split(':')[1]} ${parseInt($activeTask.dueDateTime.split('T')[1].split('-')[0]) > 11 ? 'PM': 'AM'}`}
            </div>
  
            <!-- created by -->
            <div class="is-flex is-align-items-center">
              <div class="fredoka-reg is-size-7 opacity-60p">
                Created by
              </div>
              <Avatar class='maxmins-w-20 maxmins-h-20 has-background-link mx-2 is-flex is-justify-content-center is-align-items-center'>
                <div class="fredoka-reg has-text-weight-bold has-text-white txt-size-7 is-flex is-justify-content-center is-align-items-center">
                  {#if !$activeTask.createdBy}
                  O
                  {/if}
  
                  {#each $activeWorkspace.members as member}
                    {#if member.name === $activeTask.createdBy}
                      {#if !member.profile}
                        {$activeTask.createdBy.toUpperCase().split(' ')[0].charAt(0)}{$activeTask.createdBy.toUpperCase().split(' ')[$activeTask.createdBy.toUpperCase().split(' ').length - 1].charAt(0)}
                      {:else}
                        <img
                          on:click={e => {
                            currentDP.set(member.profile)
                            viewDPModalActive.set(true)
                          }}
                          style='object-fit: cover'
                          class="maxmins-w-20 maxmins-h-20 is-clickable"
                          src={member.profile}
                          alt={`${member.name}`}
                        >
                      {/if}
                    {/if}
                  {/each}
                </div>
              </Avatar>
              <div class="fredoka-reg is-size-7 opacity-60p">
                {$activeTask.createdBy}
              </div>
            </div>
          </div>
          
          <!-- tabs -->
          <div class="mt-2 min-w-100p is-flex {outerWidth < 571 ? '': 'pl-3'}">
            {#if outerWidth > 425}
            <div
              on:click={() => {if($taskCurTab !== 'Chats') taskCurTab.set('Chats')}}
              class="has-transition hover-bg-grey-light-grey-dark rounded-t-lg has-text-centered p-2 maxmins-w-100 is-clickable fredoka-reg txt-size-13 {$taskCurTab === 'Chats'? 'has-background-grey-dark has-text-white-bis': ''} "
            >
              Chats
            </div>
            <div
              on:click={() => { if($taskCurTab !== 'Description') taskCurTab.set('Description')}}
              class="has-transition hover-bg-grey-light-grey-dark rounded-t-lg has-text-centered p-2 maxmins-w-100 is-clickable fredoka-reg txt-size-13 {$taskCurTab === 'Description'? 'has-background-grey-dark has-text-white-bis': ''} mx-2"
            >
              Descriptions
            </div>
            <div
              on:click={() => { if($taskCurTab !== 'Subtasks') taskCurTab.set('Subtasks')}}
              class="has-transition hover-bg-grey-light-grey-dark rounded-t-lg has-text-centered p-2 maxmins-w-100 is-clickable fredoka-reg txt-size-13 {$taskCurTab === 'Subtasks'? 'has-background-grey-dark has-text-white-bis': ''}"
            >
              Subtasks
            </div>
            {:else}
            <div
              on:click={() => { if($taskCurTab !== 'Chats') taskCurTab.set('Chats')}}
              class="has-transition hover-bg-grey-light-grey-dark rounded-t-lg py-1 maxmins-w-40 is-clickable {$taskCurTab === 'Chats'? 'has-background-grey-dark has-text-white-bis': ''} is-flex is-align-items-center is-justify-content-center"
            >
              <Icon size='18px' class='{$taskCurTab === 'Chats'? 'white-text': 'black-text'}' path={mdiChat} />
            </div>
            <div
              on:click={() => { if($taskCurTab !== 'Description') taskCurTab.set('Description')}}
              class="has-transition hover-bg-grey-light-grey-dark rounded-t-lg py-1 maxmins-w-40 is-clickable {$taskCurTab === 'Description'? 'has-background-grey-dark has-text-white-bis': ''} mx-2 is-flex is-align-items-center is-justify-content-center"
            >
              <Icon size='18px' class='{$taskCurTab === 'Description'? 'white-text': 'black-text'}' path={mdiText} />
            </div>
            <div
              on:click={() => { if($taskCurTab !== 'Subtasks') taskCurTab.set('Subtasks')}}
              class="has-transition hover-bg-grey-light-grey-dark rounded-t-lg py-1 maxmins-w-40 is-clickable {$taskCurTab === 'Subtasks'? 'has-background-grey-dark has-text-white-bis': ''} is-flex is-align-items-center is-justify-content-center"
            >
              <Icon size='18px' class='{$taskCurTab === 'Subtasks'? 'white-text': 'black-text'}' path={mdiViewList} />
            </div>
            {/if}
          </div>
  
          <!-- tabs content -->
          <div class="has-background-white min-w-100p min-h-380 rounded-b rounded-r elevation-1 {$taskCurTab === 'Description' ? '': 'px-3'}">
            {#if $taskCurTab === 'Chats'}
            <!-- Chats -->
            <div class="maxmins-w-100p maxmins-h-100p is-flex is-flex-direction-column-reverse is-justify-content-flex-end pt-1">
              <!-- Chat input, tools, and send button -->
              <div class="is-flex is-align-items-center {outerWidth < 571 ? '': 'px-5'} mt-1">
                <!-- chat input -->
                <input disabled={chatInputDisable} bind:value={chatInput} type="text" class="input rounded-lg txt-size-{outerWidth < 376 ? '10': '15'} fredoka-reg" placeholder="Type a message...">
  
                <!-- tools -->
                <div class="is-flex is-align-items-center is-clickable mx-2">
                  <Icon class='blue-text' path={mdiDotsVertical} />
                </div>
  
                <!-- send button -->
                <div
                  on:click={insertChat}
                  class="is-flex is-align-items-center is-clickable"
                >
                  <Icon class='blue-text' path={mdiSend} /> 
                </div>
              </div>
  
              <!-- Chats container -->
              <div bind:this={chatContainer} class="is-flex-grow-1 max-h-330 overflow-y-auto">
                <div class="is-flex is-flex-direction-column">
                  <!-- LOOP HERE -->
                  {#each $activeTask.conversations as chat, i}
                  <!-- chat -->
                  <div class="is-flex min-w-100p hover-bg-grey-lighter cursor-def rounded p-1 parent">
                    {#if !i || chat.sender.email !== $activeTask.conversations[i - 1].sender.email}
                    <!-- Profile -->
                      {#if !chat.sender.profile}
                      <div class="is-flex is-align-items-center">
                        <Avatar size='30px' class='has-background-info mr-2 maxmins-w-30 maxmins-h-30'>
                          <div class="fredoka-reg has-text-white has-text-weight-semibold txt-size-12">
                            {chat.sender.name.toUpperCase().split(' ')[0].charAt(0)}{chat.sender.name.toUpperCase().split(' ')[chat.sender.name.toUpperCase().split(' ').length - 1].charAt(0)}
                          </div>
                        </Avatar>
                      </div>
                      {:else}
                      <div class="is-flex is-align-items-center">
                        <Avatar size='30px' class='has-background-info mr-2 maxmins-w-30 maxmins-h-30'>
                          <img src={chat.sender.profile} alt={chat.sender.name}>
                        </Avatar>
                      </div>
                      {/if}
                    {:else}
                    <div class="is-flex is-align-items-center">
                      <Avatar class='is-invisible has-background-white mr-2 maxmins-w-30 maxmins-h-10'>
                        <div class="fredoka-reg has-text-white has-text-weight-semibold txt-size-12"/>
                      </Avatar>
                    </div>
                    {/if}
  
                    <!-- name, message and time -->
                    <div class="is-flex-grow-1 is-flex is-relative">
                      <!-- name and message -->
                      <div class="is-flex-grow-1 is-flex-shrink-0">
                        {#if !i || chat.sender.email !== $activeTask.conversations[i - 1].sender.email}
                        <!-- name -->
                        <div class="inter-reg txt-size-{outerWidth < 376 ? '8': '11'}" style='color: #A4A4A4;'>
                          {chat.sender.name}
                        </div>
                        {/if}
  
                        <!-- message -->
                        <div class="inter-reg txt-size-{outerWidth < 376 ? '10': '15'} min-w-100p">
                          {chat.message}
                        </div>
                      </div>
  
                      <!-- time -->
                      <div class="{outerWidth < 376 ? 'pos-abs pos-r-5 txt-size-7': 'txt-size-10'} opacity-0 parent-hover-this-opacity-100 fredoka-reg is-italic has-text-grey is-flex-shrink-0">
                        {constants.getDate(chat.sendAt)}
                      </div>
                    </div>
                  </div>
                  {/each}
                </div>
              </div>
            </div>
            {:else if $taskCurTab === 'Description'}
            <div
              class="maxmins-h-100p is-flex is-flex-direction-column pb-2 overflow-y-auto"
            >
              {#if editing}
              <textarea disabled={$isProcessing} on:keydown={descKeydownHandler} bind:value={descriptionValue} class="textarea maxmins-h-325 txt-size-18 inter-reg txt-color-yaz-grey-dark textarea-resize-none border-none" placeholder="Description" rows="10" />
              {:else}
              <div class="maxmins-h-325 txt-size-18 inter-reg txt-color-yaz-grey-dark pl-3 pr-2 pt-3 overflow-y-auto">
                <span class="opacity-35p {descriptionValue ? 'undisp' : ''}">
                  Description
                </span>
                <SvelteMarkdown source={descriptionValue} />
              </div>
              {/if}
              <div class="is-flex is-justify-content-flex-end mt-2">
                {#if editing}
                <!-- cancel button -->
                <button
                  use:Ripple={{color: 'hsl(0, 91%, 73%)'}}
                  on:click={() => descriptionSave(false)}
                  class='button parent has-transition fredoka-reg py-0 border-none hover-bg-grey-lighter'
                >
                  Cancel <span class="ml-2 p-1 has-transition tag parent-hover-bg-color-grey parent-hover-txt-color-white rounded has-text-weight-light txt-size-10"> esc </span>
                </button>
                {/if}
  
                <!-- edit/ save button -->
                <button
                  use:Ripple={{color: `${editing ? 'hsl(133, 45%, 74%)': ''}`}}
                  on:click={() => {
                    if(editing) {
                      descriptionSave(true)
                    }else{
                      editing = true
                    }
                  }}
                  class='button parent has-transition fredoka-reg {editing ? 'is-success': 'border-none hover-bg-grey-lighter'} mx-2'
                >
                  {editing ? 'Save': 'Edit'}
                  {#if editing}
                  <span class="ml-2 p-1 has-transition tag parent-hover-bg-color-grey parent-hover-txt-color-white rounded has-text-weight-light txt-size-10">
                    Ctrl + Enter
                  </span>
                  {/if}
                </button>
              </div>
            </div>
            {:else}
            <div
              class="maxmins-h-100p"
            >
              <!-- subtasks title and add icon button -->
              <div class="min-w-100p pb-1">
                <div class="is-flex is-justify-content-space-between mt-1">
                  <div class="inter-reg txt-szie-11 has-text-weight-medium txt-color-yaz-grey-dark">
                    Subtask
                  </div>
  
                  <!-- filter and add icon button -->
                  <div class="is-flex">
                    <!-- filter -->
                    <Button icon={outerWidth < 321 ? true: false} text={outerWidth > 320 ? true: false} size='small' >
                      <span class="{outerWidth < 321 ? 'undisp': ''} fredoka-reg txt-size-10 grey-text text-darken-1 mr-1">
                        filter
                      </span>
                      <Icon size='10px' class='grey-text text-darken-1' path={mdiFilter} />
                    </Button>
  
                    <!-- add -->
                    <Button icon={outerWidth < 321 ? true: false} text={outerWidth > 320 ? true: false} size='small'>
                      <span class="{outerWidth < 321 ? 'undisp': ''} fredoka-reg txt-size-10 grey-text text-darken-1 mr-1">
                        Add
                      </span>
                      <Icon size='15px' class='grey-text text-darken-1' path={mdiPlus} />
                    </Button>
                  </div>
                </div>
              </div>
  
              <!-- subtasks of task -->
              <div class="min-w-100p">
                <!-- container -->
                <div class="is-flex is-flex-direction-column">
                  <!-- LOOP HERE -->
                  {#each $activeTask.subtasks as subtask}
                  <!-- subtask card / brief details -->
                  <div class="is-flex-grow-1 is-flex is-justify-content-space-between is-align-items-center parent is-relative hover-bg-grey-lighter has-transition border-b-color-yaz-grey-dark border-w-b-1 border-type-b-solid">
                    <!-- subtask name -->
                    <div class="inter-reg is-size-6 txt-color-yaz-grey-dark pl-1 is-clickable hover-txt-color-primary max-w-50p txt-overflow-ellipsis overflow-x-hidden">
                      {subtask.name}
                    </div>
  
                    <!-- level, status and trash -->
                    <div class="is-flex is-align-items-center p-1">
                      <!-- level -->
                      <Avatar tile size='22px' style="max-width: 22px" class="is-unselectable dmsans has-text-weight-bold bg-color-yaz-{subtask.level == 1 ? 'green': subtask.level == 2 ? 'yellow': 'red'} has-text-white fredoka-reg txt-size-9 rounded is-clickable mr-2">
                        {subtask.level == 1 ? 'L': subtask.level == 2 ? 'M': 'H'}
                      </Avatar>
  
                      <!-- status -->
                      <div class="tag is-success is-light fredoka-reg txt-size-9 has-text-weight-semibold ml-1">
                        {subtask.status}
                      </div>
  
                      <!-- trash -->
                      <div class="{outerWidth < 571 ? '': 'undisp'} ml-2 is-invisible parent-hover-this-display-block">
                        <Icon size='22px' path={mdiTrashCan} />
                      </div>
                      
                      <!-- trash 2 -->
                      <div
                        on:click={() => console.log('trash clicked')}
                        class="pos-abs pos-r-5 z-100 {outerWidth < 571 ? '': 'undisp parent-hover-this-display-block'} is-clickable">
                        <Icon size='22px' path={mdiTrashCan} />
                      </div>
                    </div>
                  </div>
                  {/each}
                </div>
              </div>
            </div>
            {/if}
          </div>
        </div>
        {/if}
      </div>
  
      <!-- ##### LEFT SIDE ##### -->
      <div class="{outerWidth < 571 && !leftView ? 'undisp': ''} {outerWidth >= 571 ? 'border-w-l-2 border-l-color-yaz-grey border-type-l-solid' : ''} maxmins-w-{outerWidth < 571 ? '100' : '35'}p">
        <!-- status, views & viewers, close button -->
  
        <div class="pl-3 pb-3 is-flex is-justify-content-space-between border-w-b-3 border-b-color-yaz-grey border-type-b-solid">
          <!-- Container -->
          <div class="is-flex">
            {#if $isProcessing}
            <div class="maxmins-w-100p maxmins-h-100p is-flex is-justify-content-center is-align-items-center">
              <Pulse size={20} color='#191a48' />
            </div>
            {:else}
            <!-- status and views and viewers -->
            <div class="is-flex-shrink-0 is-flex is-align-items-center">
              <!-- status -->
              <div use:ClickOutside on:clickOutside={() => drop1 = false} class='is-relative min-w-150 min-h-fit-content'>
                <div
                  on:click={() => {
                    if(drop1) {
                      drop1 = false
                    } else {
                      drop1 = true
                    }
                  }}
                  class="select min-w-100p border-w-1 border-color-grey-light border-type-solid rounded is-clickable has-background-white is-flex is-align-items-center pl-2"
                >
                  <div class="inter-reg txt-size-12 txt-color-yaz-grey-dark">
                    {$activeTask.status}
                  </div>
                </div>
  
                <div class="pos-abs pos-t-40 has-background-white min-w-100p has-transition elevation-1 rounded-b {drop1 ? 'rot-x-0': 'rot-x-90'} z-100" style="transform-origin: top center">
                  <!-- Loop here -->
  
                  <!-- status -->
                  {#each $allBoards as board}
                    {#if board.name !== $activeTask.status}
                      <div
                        on:click={() => {
                          if($isProcessing) return
                          updateStatus(board.name)
                          drop1 = false
                        }}
                        class="hover-bg-grey-lighter has-transition p-3 is-clickable"
                      >
                        <div class='inter-reg txt-size-12 txt-color-yaz-grey-dark'>
                          {board.name}
                        </div>
                      </div>
                    {/if}
                  {/each}
                </div>
              </div>
  
              <!-- views and viewers -->
              {#if $userData.verified}
              <div
                on:click={() => {
                  viewersModalActive = true
                }}
                class="is-flex is-align-items-center ml-3 is-clickable"
              >
                <Icon class='txt-color-yaz-grey-dark mr-1' path={mdiEyeOutline} />
                <div class="fredoka-reg txt-size-12 is-flex is-justify-content-center is-align-items-center">
                  {$activeTask.viewers.length}
                </div>
  
              </div>
              
              <!-- viewers name modal -->
              <Dialog persistent bind:active={viewersModalActive} class='p-2'>
                <!-- header -->
                <div class="is-flex is-justify-content-space-between is-align-items-center">
                  <div class="fredoka-reg txt-size-16 txt-color-yaz-grey-dark">
                    Seen by:
                  </div>
  
                  <!-- Close icon/button -->
                  <div
                    on:click={() => {
                      viewersModalActive = false
                    }}
                    class='is-clickable is-flex-shrink-0'
                  >
                    <Avatar tile size='25px' style="max-width: 25px" class="bg-color-yaz-red has-transition hover-bg-danger has-text-white rounded">
                      <Icon path={mdiClose} />
                    </Avatar>
                  </div>
                </div>
  
                <!-- seeners -->
                <div class="is-flex is-flex-direction-column mt-3">
                  {#each $activeTask.viewers as viewer}
                  <div class="inter-reg txt-size-15 hover-bg-grey-lighter pl-2 rounded mb-1 cursor-def">
                    {viewer}
                  </div>
                  {/each}
                </div>
              </Dialog>
              {/if}
            </div>
            {/if}
          </div>
  
          <!-- close button -->
          <div
            on:click={() => {
              if(leftView) {
                  leftView = false
                  return
                }
              taskViewModalActive.set(false)
            }}
            class='is-clickable is-flex-shrink-0 {outerWidth < 571 && !leftView ? 'undisp': ''}'
          >
            <Avatar tile size='25px' style="max-width: 25px" class="bg-color-yaz-red has-transition hover-bg-danger has-text-white rounded">
              <Icon path={mdiClose} />
            </Avatar>
          </div>
        </div>
  
        <!-- Assignee/s -->
        <div class="py-3 pl-3 is-flex is-flex-direction-column is-justify-content-space-between maxmins-h-90p overflow-y-auto">
          {#if $isProcessing}
          <div class="maxmins-w-100p maxmins-h-100p is-flex is-justify-content-center is-align-items-center">
            <Pulse size={20} color='#191a48' />
          </div>
          {:else}
          <!-- Assignees title -->
          <div class="txt-size-14 fredoka-reg txt-color-yaz-grey-dark">
            Assignees
          </div>
  
          <!-- dropdown -->
          {#if $userData.verified}
          <div
            use:ClickOutside
            on:clickOutside={() => {
              if(drop) {
                assigneeUpdated()
              }
            }}
            class='is-relative min-h-fit-content'
          >
            <input
              on:change={() => {
                searchingMember = true
                filterMembers()
              }}
              on:click={() => {
                if(drop) {
                  assigneeUpdated()
                } else {
                  searchingMember = true
                  drop = true
                }
              }}
              bind:value={assigneeInputValue}
              class="input min-w-100p border-w-1 border-color-grey-light border-type-solid rounded-t has-background-white"
            />
  
            <!-- dropdown content -->
            <div class="pos-abs pos-t-40 has-background-white min-w-100p has-transition elevation-1 rounded-b {drop ? 'rot-x-0': 'rot-x-90'} z-90" style="transform-origin: top center">
              <!-- Loop here -->
              {#each workspaceMembersCopy as workspaceMember, i}
                {#if $activeTask.members.filter(member => member.id === workspaceMember.id).length == 0}
                  <div class="hover-bg-grey-lighter has-transition p-3">
                    <Checkbox bind:group={selectedWorkspaceMembers} value={workspaceMember}>
                      <div>
                        <!-- Name -->
                        <div class='inter-reg txt-size-12 txt-color-yaz-grey-dark is-clickable'>
                          {workspaceMember.name}
                        </div>
          
                        <!-- email -->
                        <div class="inter-reg txt-size-9 txt-color-yaz-grey-dark is-clickable">
                          {workspaceMember.email}
                        </div>
                      </div>
                    </Checkbox>
                  </div>
                {/if}
              {/each}
            </div>
          </div>
          {/if}
  
          <!-- list of assigned members -->
          {#each activeTaskMembers as taskAssignee}
          <!-- container -->
          <div class="is-flex is-align-items-center is-justify-content-space-between mt-3 rounded hover-bg-grey-lighter has-transition p-1">
            <div class="is-flex is-align-items-center">
              <!-- profile -->
              {#if !taskAssignee.profile}
                <Avatar size='{outerWidth < 571 ? '30' : '50'}px' class='has-background-info mr-3 maxmins-w-{outerWidth < 571 ? '30' : '50'}'>
                  <div class="has-text-white has-text-weight-semibold txt-size-15 fredoka-reg">
                    {taskAssignee.name.toUpperCase().split(' ')[0].charAt(0)}{taskAssignee.name.toUpperCase().split(' ')[taskAssignee.name.toUpperCase().split(' ').length - 1].charAt(0)}
                  </div>
                </Avatar>
              {:else}
                <div on:click={e => {
                    currentDP.set(taskAssignee.profile)
                    viewDPModalActive.set(true)
                  }}
                  class='is-clickable'
                >
                  <Avatar size='{outerWidth < 571 ? '30' : '50'}px' class='has-background-info mr-3 maxmins-w-{outerWidth < 571 ? '30' : '50'}'>
                    <img src={taskAssignee.profile} alt="">
                  </Avatar>
                </div>
              {/if}
  
              <!-- name and email -->
              <div>
                <div class="inter-reg txt-size-12 tx-color-yaz-grey-dark">
                  {taskAssignee.name}
                </div>
  
                <div class="inter-reg txt-size-9 tx-color-yaz-grey-dark">
                  {taskAssignee.email}
                </div>
              </div>
            </div>
  
            <!-- remove assignment -->
            <div
              on:click={e => {
                if($isProcessing) return
                removeMember(taskAssignee)
              }}
              class="is-clickable"
            >
              {#if !$isProcessing && !removingMember}
                <Icon size='18px' class="red-text" path={mdiClose} />
              {:else if !removingMember}
                <Icon size='18px' class="red-text" path={mdiClose} />
              {:else}
                <Pulse size={20} color='#191a48' />
              {/if}
            </div>
          </div>
          {/each}
  
          <div class="flex-grow-1" />
  
          <!-- trash/ delete task -->
          <div class="maxmins-w-100p is-flex is-justify-content-flex-end">
            {#if !$isProcessing}
              <div
                on:click={e => {
                  taskViewModalActive.set(false)
                  taskDeleteModalActive.set(true)
                }}
                class="maxmins-w-50p has-background-danger is-flex is-justify-content-center is-align-items-center py-2 rounded is-clickable">
                <Icon size='25px' class='white-text' path={mdiTrashCan} />
                <div class="fredoka-reg txt-size-14 ml-2 has-text-white">
                  Delete task
                </div>
              </div>
            {:else}
              <Pulse size={20} color='#191a48' />
            {/if}
          </div>
          {/if}
        </div>
  
      </div>
    </div>
  </div>
</MaterialApp>

<ViewDp />