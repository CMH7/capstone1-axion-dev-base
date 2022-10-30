<script>
  //@ts-nocheck
	import { editBasic, uploadPicModalActive } from '$lib/stores/myProfile';
  import { isProcessing, userData, notifs } from '$lib/stores/global-store';
  import { mdiClose, mdiImageEditOutline, mdiPencil } from '@mdi/js';
  import { Dialog, Button, Icon, TextField, MaterialApp, Textarea } from 'svelte-materialify'
	import validators from '$lib/config/validators';
	import constants from '$lib/config/constants';
  import { Pulse } from 'svelte-loading-spinners'
  import bcrypt from 'bcryptjs'

  let picHovering = false
  let firstName = $userData.firstName
  let lastName = $userData.lastName
  let school = $userData.school
  let course = $userData.course
  let bio = $userData.bio
  let age = $userData.age
  let year = $userData.year
  let outerWidth

  const close = e => {
    editBasic.set(false)
  }

  const uploadProfile = e => {
    editBasic.set(false)
    uploadPicModalActive.set(true)
  }

  const stringRules = [
    (v) => {
      if(v === '') return 'First name cannot be empty'
      if(validators.containsDigit(v)) return 'Warning of the digit in the name'
      return true
    }
  ]

  const save = e => {
    $notifs = [...$notifs, {
      msg: 'Information saving',
      type: 'wait',
      id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
    }]
    isProcessing.set(true)
    fetch(`${constants.backURI}/MainApp/myprofile/basic/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: {
          id: $userData.id,
          firstName,
          lastName,
          age: parseInt(age),
          year: parseInt(year),
          school,
          course,
          bio
        }
      })
    }).then(async res => {
      const data = await res.json()
      const data2 = data.userData
      let userDataCopy = $userData
      userDataCopy.firstName = data2.firstName
      userDataCopy.lastName = data2.lastName
      userDataCopy.age = data2.age
      userDataCopy.year = data2.year
      userDataCopy.bio = data2.bio
      userDataCopy.school = data2.school
      userDataCopy.course = data2.course
      userData.set(userDataCopy)
      
      firstName = $userData.firstName
      lastName = $userData.lastName
      school = $userData.school
      course = $userData.course
      bio = $userData.bio
      age = $userData.age
      year = $userData.year

      $notifs = [...$notifs, {
        msg: 'Information saved!',
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      isProcessing.set(false)
    }).catch(err => {
      $notifs = [...$notifs, {
        msg: 'Information saving failed.',
        type: 'stayError',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      isProcessing.set(false)
    })
  }
</script>

<svelte:window bind:outerWidth />

<Dialog persistent bind:active={$editBasic} class="has-background-white-bis is-flex is-flex-direction-column p-3">
  <!-- title and close -->
  <div class="is-flex is-justify-content-space-between is-align-items-center maxmins-w-100p">
    <!-- title -->
    <div class="inter-reg txt-size-20 has-text-weight-bold">
      Basic information
    </div>

    <!-- close button -->
    <div
      on:click={close}
      class="has-background-danger is-clickable is-flex is-justify-content-center is-align-items-center rounded"
    >
      <Icon class="white-text" path={mdiClose} />
    </div>
  </div>

  <!-- container -->
  <div class="maxmins-w-100p is-flex is-flex-direction-column is-align-items-center mt-3 is-relative">
    <!-- profile picture -->
    {#if outerWidth >= 571}
      <div
        on:mouseenter={e => picHovering = true}
        class="maxmins-w-150 maxmins-h-150 is-flex is-justify-content-center is-align-items-center rounded-circle border-color-yaz-grey-dark border-w-1 border-type-solid"
      >
        <img style="object-fit: cover;" class="rounded-circle maxmins-w-150 maxmins-h-150" src="{$userData.profile}" alt="{$userData.firstName} {$userData.lastName}" />
      </div>
      {#if picHovering}
      <div
        on:click={uploadProfile}
        on:mouseleave={e => picHovering = false}
        class="is-clickable maxmins-w-150 maxmins-h-150 pos-abs pos-t-0 has-background-black opacity-40p rounded-circle is-flex is-align-items-center is-justify-content-center"
      >
        <Icon size="50px" class='white-text' path={mdiImageEditOutline} />
      </div>
      {/if}
    {:else}
      <div
          on:mouseenter={e => picHovering = true}
          class="maxmins-w-150 maxmins-h-150 is-flex is-justify-content-center is-align-items-center rounded-circle border-color-yaz-grey-dark border-w-1 border-type-solid"
        >
        <img style="object-fit: cover;" class="rounded-circle maxmins-w-150 maxmins-h-150" src="{$userData.profile}" alt="{$userData.firstName} {$userData.lastName}" />
      </div>
      <div
          on:click={uploadProfile}
          on:mouseleave={e => picHovering = false}
          class="is-clickable maxmins-w-150 maxmins-h-150 pos-abs pos-t-0 has-background-black opacity-40p rounded-circle is-flex is-align-items-center is-justify-content-center"
        >
        <Icon size="50px" class='white-text' path={mdiImageEditOutline} />
      </div>
    {/if}

    <!-- user name -->
    <!-- <input placeholder="{$userData.firstName} {$userData.lastName}" type="text" class="maxmins-w-100p border-color-yaz-grey-dark border-w-1 border-type-solid mt-10 py-2 pl-3 rounded"> -->
    <div class="mt-6 maxmins-w-100p">
      <MaterialApp>
        <!-- firstName -->
        <TextField
          disabled={$isProcessing}
          dense
          outlined
          rules={stringRules}
          bind:value={firstName}
          placeholder="{$userData.firstName}"
        >
          <div class='is-clickable' slot='append'>
            {#if $userData.firstName === firstName}
              <Icon size='15px' path={mdiPencil} />
            {:else}
              <div></div>
            {/if}
          </div>
          Edit first name
        </TextField>
        
        <!-- lastName -->
        <TextField
          disabled={$isProcessing}
          dense
          outlined
          rules={stringRules}
          bind:value={lastName}
          placeholder="{$userData.lastName}"
          class='mt-3'
        >
          <div class='is-clickable' slot='append'>
            {#if $userData.lastName === lastName}
              <Icon size='15px' path={mdiPencil} />
            {:else}
              <div></div>
            {/if}
          </div>
          Edit last name
        </TextField>
        
        <!-- age -->
        <TextField
          disabled={$isProcessing}
          type='number'
          rules={[
            (v) => {
              if(v <= 11) {
                return 'Age is too young'
              }
              if(v >= 71) {
                return 'Age is too old'
              }
              return true
            },
          ]}
          bind:value={age}
          dense
          placeholder="{$userData.age}"
          class='mt-3'
          outlined
        >
          <div slot='append'>
            <div class="maxmins-w-10"/>
          </div>
          Edit age
        </TextField>

        <!-- school -->
        <TextField
          disabled={$isProcessing}
          list='schoolsPH'
          type='text'
          rules={[
            (v) => {
              if(v === '') return 'School name cannot be empty'
            }
          ]}
          bind:value={school}
          dense
          placeholder="{$userData.school}"
          class='mt-3'
          outlined
        >
          <div slot='append'>
            <div class="maxmins-w-10"/>
          </div>
          Edit school
        </TextField>
        <datalist id='schoolsPH'>
          {#each constants.schools.school as school }
            <option value={school}>{school}</option>
          {/each}
        </datalist>

        <!-- course -->
        <TextField
          disabled={$isProcessing}
          list='coursesPH'
          type='text'
          rules={[
          (v) => {
          if(v === '') return 'Course name cannot be empty'
          }
          ]}
          bind:value={course}
          dense
          placeholder="{$userData.course}"
          class='mt-3'
          outlined
        >
          <div slot='append'>
            <div class="maxmins-w-10"/>
          </div>
          Edit course
        </TextField>
        <datalist id='coursesPH'>
          {#each constants.courses.courses as course }
            <option value={course}>{course}</option>
          {/each}
        </datalist>

        <!-- age -->
        <TextField
          disabled={$isProcessing}
          type='number'
          rules={[
            (v) => {
              if(v < 1 || v > 6) return 'Year is invalid'
              return true
            },
          ]}
          bind:value={year}
          dense
          placeholder="{$userData.year}"
          class='mt-3 mb-3'
          outlined
        >
          <div slot='append'>
            <div class="maxmins-w-10"/>
          </div>
          Edit year
        </TextField>
        
        <!-- bio -->
        <Textarea
          disabled={$isProcessing}
          outlined
          dense
          bind:value={bio}
          placeholder="{$userData.bio}"
          counter={100}
          rules={[
            v => {
              if(v.length > 100) return '100 characters max only'
              return true
            }
          ]}
        >
          Edit bio
        </Textarea>

        {#if !$isProcessing && ((firstName !== $userData.firstName && firstName !== '') || (lastName !== $userData.lastName && lastName !== '') || (age != $userData.age && age >= 12 && age <= 70) || (school !== $userData.school && school !== '') || (course !== $userData.course && course !== '') || bio !== $userData.bio || (year != $userData.year && year > 0 && year <= 6))}
          <div
            on:click={save}
            class="maxmins-w-100p is-flex mt-6 is-justify-content-flex-end"
          >
            <Button depressed class='green lighten-1 white-text inter-reg'>
              Save
            </Button>
          </div>
        {:else if $isProcessing}
          <div class="maxmins-w-100p is-flex mt-6 is-justify-content-flex-end">
            <Pulse color='#fddd3f' size={20} />
          </div>
        {/if}
      </MaterialApp>
    </div>
  </div>
</Dialog>