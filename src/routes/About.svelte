<script>
  import HomeFooter from "$lib/components/Home-footer.svelte";
  import HomeHeader from "$lib/components/Home-header.svelte";
  import Button from "$lib/components/Button.svelte";
  import { Tabs, Tab, Window, WindowItem, AppBar, MaterialApp } from "svelte-materialify";

  let value = 0;
</script>

<MaterialApp> 
  <!-- header -->
  <HomeHeader/>
    <div class="hero is-fullheight-with-navbar">
      <div class="hero-head p-6 has-background-light"> 
          <!--Title-->
          <div class="columns mx-6 m-5 mr-5 is-flex is-justify-content-center is-multiline is-align-items-center">
            <div class="column mt-0 is-align-items-center is-mobile">
                <p class="mt-4 mb-5 is-size-3-desktop is-size-4-tablet is-size-5-mobile is-primary has-text-centered fredokaone"> <span style="font-size: 150%;">What is Axion?</span></p>
            <!-- Paragraphs/Texts about Axion -->        
                <p class="m-4 dm-sans has-text-centered is-size-3-desktop is-size-4-tablet is-size-5-mobile">Axion is a task management application meant to fit with the academic setting of college students- for them to manage their tasks and help them achieve better output.</p>
            </div>            
             <!--Image--> 
            <div class="column is-6-tablet is-12-mobile">
              <div class="is-flex is-justify-center is-align-items-center is-multiline">
                  <img width="100%" height="100%" src="Icons/about-page.png" alt="icon1"/>
              </div>
            </div>
          </div>

        <!-- 'Get Started' button (leads to Sign Up) -->
        <div class="is-flex flex-column is-align-items-center">
          <div class="mt-2 py-3">
            <Button type="primary" text="Get Started" href="/Signup" textcss="dm-sans has-text-weight-bold is-size-6" on:click/>
          </div>
        </div>
      </div>
    </div>
      

  
    <!-- Greyish background -->
    <div class="hero-body mx-4 px-3 py-3"> 

      <!-- 1st feature (image sa left, text sa right) -->
      <div class="columns my-2 py-4 is-flex is-justify-content-center is-align-items-center is-multiline has-background-light">
        
        <!-- Image -->
        <div class="column is-6-tablet is-9-mobile">
          <div class="is-flex is-justify-content-center">
            <img width="50%" height="50%" src="Icons/icon1.png" alt="icon1"/>
          </div>
        </div>

        <!-- Supporting text -->
        <div class="column mr-6 is-flex is-justify-content-start is-multiline has-background-light">
            <p class="is-size-4-tablet is-size-5-mobile is-primary has-text-centered dm-sans has-text-weight-bold"> In Axion, you can <span class="is-size-2-tablet is-size-3-mobile fredokaone mx-3 has-text-primary" style="font-weight:1000;">Organize</span> your tasks in your own productive workspace.</p>
        </div>
      </div>

      <br/>
    
      <!-- 2nd feature (text sa left, image sa right) -->
      <div class="columns py-4 is-flex is-justify-content-center is-align-items-center is-mobile is-multiline has-background-light">

        
        <!-- Supporting text -->
        <div class="column is-hidden-mobile is-flex is-justify-content-center is-multiline has-background-light">
          <p class="is-size-4-tablet is-size-5-mobile is-primary has-text-centered dm-sans has-text-weight-bold">Axion has an automated function that puts emphasis on tasks that are <span class="is-size-2-tablet is-size-3-mobile fredokaone mx-3 has-text-primary" style="font-weight:100;">most urgent and most prioritized-</span> so that you can see them before other tasks, right away.</p>
        </div>

        <!-- Image -->
        <div class="column is-6-tablet is-9-mobile">
            <div class="is-flex is-justify-content-center">
              <img width="50%" height="50%" src="Icons/icon2.png" alt="icon2"/>
            </div>
          </div>

          <div class="column is-hidden-tablet is-flex is-justify-content-center is-multiline has-background-light">
            <p class="is-size-4-tablet is-size-5-mobile is-primary has-text-centered dm-sans has-text-weight-bold">Axion has an automated function that puts emphasis on tasks that are <span class="is-size-2-tablet is-size-3-mobile fredokaone mx-3 has-text-primary" style="font-weight:100;">most urgent and most prioritized-</span> so that you can see them before other tasks, right away.</p>
          </div>
  
        </div>
        
        <br/>
    
      <!-- 3rd feature -->
      <div class="columns py-4 is-flex is-justify-content-center is-align-items-center is-multiline has-background-light">
        
        <!-- Image -->
        <div class="column is-6-tablet is-9-mobile">
          <div class="is-flex is-justify-content-center">
            <img width="50%" height="50%" src="Icons/icon3.png" alt="icon3"/>
          </div>
        </div>

        <!-- Supporting text -->
        <div class="column mr-6 is-flex is-justify-content-center is-multiline has-background-light">
          <p class="is-size-4-tablet is-size-5-mobile is-primary has-text-centered dm-sans has-text-weight-bold">Invite your co-members for <span class="is-size-2-tablet is-size-3-mobile fredokaone mx-3 has-text-primary" style="font-weight:100;">Group activities</span> and let data synchronize across your screens.</p>
        </div>
      </div>

        <!-- text (another feature)-->
        <AppBar class="mt-6">
          <Tabs grow class="primary" bind:value fixedTabs>
            <div slot="tabs">
              <Tab>Kanban</Tab>
              <Tab>Calendar</Tab>
              <Tab>favorites</Tab>
              <Tab>Assigned to Me</Tab>
            </div>
          </Tabs>
        </AppBar>
        
        <Window {value} class="py-6 has-background-light">
          <WindowItem>
                <!-- 4th feature (image sa left, text sa right) -->
                <div class="columns px-6 is-flex is-justify-content-center is-align-items-center is-multiline">
                  <!-- Image -->
                  <div class="column is-6-tablet is-9-mobile">
                    <div class="is-flex is-justify-content-center">
                      <img width="50%" height="50%" src="Icons/icon4.png" alt="icon4"/>
                    </div>
                  </div>

                  <!-- Supporting text -->
                  <div class="column is-flex is-mobile is-justify-content-center is-multiline">
                    <p class="is-size-3-tablet is-size-4-mobile is-primary has-text-centered dm-sans has-text-weight-bold"> See how the Kanban board indicates the progress of your tasks.</p>
                  </div>
                </div>
          </WindowItem>
          <WindowItem>
              <!-- 5th feature (image sa left, text sa right) -->
              <div class="columns px-6 is-flex is-justify-content-center is-align-items-center is-multiline">

                <!-- Image -->
                <div class="column is-6-tablet is-9-mobile">
                  <div class="is-flex is-justify-content-center">
                    <img width="50%" height="50%" src="Icons/icon5.png" alt="icon5"/>
                  </div>
                </div>

                <!-- Supporting text -->
                <div class="column is-flex is-mobile is-justify-content-center is-multiline">
                  <p class="is-size-3-tablet is-size-4-mobile is-primary has-text-centered dm-sans has-text-weight-bold"> Anticipate your next move by viewing the Calendar.</p>
                </div>
              </div>
          </WindowItem>
          <WindowItem>
              <!-- 6th feature (image sa left, text sa right) -->
              <div class="columns px-6 is-flex is-justify-content-center is-align-items-center is-multiline">

                  <!-- Image -->
                  <div class="column is-6-tablet is-9-mobile">
                    <div class="is-flex is-justify-content-center">
                      <img width="50%" height="50%" src="Icons/icon6.png" alt="icon6"/>
                    </div>
                  </div>

                  <!-- Supporting text -->
                  <div class="column is-mobile is-justify-content-center is-multiline">
                    <p class="is-size-3-tablet is-size-4-mobile is-primary has-text-centered dm-sans has-text-weight-bold"> You can mark favorites to quickly access your tasks-</p>
                  </div>
              </div>
          </WindowItem>
          <WindowItem>
                <!-- 7th feature (image sa left, text sa right) -->
                <div class="columns px-6 is-flex is-justify-content-center is-align-items-center is-multiline">
                  <!-- Image -->
                  <div class="column is-6-tablet is-9-mobile">
                    <div class="is-flex is-justify-content-center">
                      <img width="50%" height="50%" src="Icons/icon7.png" alt="icon7"/>
                    </div>
                  </div>

                  <!-- Supporting text -->
                  <div class="column is-flex-direction is-mobile is-justify-content-center is-multiline">
                    <p class="is-size-3-tablet is-size-4-mobile is-primary has-text-centered dm-sans has-text-weight-bold"> Or see what tasks are assigned to you.</p>
                  </div>
                </div>
          </WindowItem>
        </Window>
      </div>
    
    
    <div class="hero head m-6"> 
      <p class="mt-5 mb-3 is-size-3-tablet is-size-4-mobile is-primary has-text-weight-bold has-text-centered dm-sans">Managing your academic work here in Axion is simple and easy.</p>
      
      <!-- 'Get Started' button (leads to Sign Up) -->
      <div class="is-flex flex-column is-align-items-center">
        <div class="mt-3 mb-10">
          <Button type="primary" text="Get Started" href="/Signup" textcss="dm-sans has-text-weight-bold is-size-5" on:click/>
        </div>
      </div>
    </div>
    
    <!--footer-->
    <div class="hero-foot">
      <HomeFooter/>
</MaterialApp>