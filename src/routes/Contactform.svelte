<script>
  import { Card, CardActions, Icon,  MaterialApp } from "svelte-materialify"
  import { mdiGoogle, mdiFacebook } from '@mdi/js'
  import HomeHeader from "$lib/components/Home-header.svelte"
  import HomeFooter from "$lib/components/Home-footer.svelte"
  import {fade} from 'svelte/transition'
  import ComingSoonModal from "$lib/components/ComingSoonModal.svelte"

  let comingSoonModalOpen = false
  const openComingSoon = () => {
    if (!comingSoonModalOpen) {
      comingSoonModalOpen = true
    } else {
      comingSoonModalOpen = false
      comingSoonModalOpen = true
    }
  }
</script>

<svelte:head>
  <title>Axion | Contacts</title>
</svelte:head>

<ComingSoonModal active={comingSoonModalOpen}/>

<HomeHeader/>
<MaterialApp>
  <div class="hero is-fullheight-with-navbar">
    <!--BANNER-->
    <figure class="column is-20-mobile">
      <img class="is-rounded" src="/Banner.jpg" alt="background" />
    </figure>
    
    <!--DEVELOPER-->    
    <div class="hero head m-6">
      <p class="mb-10 is-size-1-tablet is-size-4-mobile is-primary has-text-weight-bold has-text-centered quicksands">Our Teams are here to help</p>
        <div class="columns is-mobile is-centered is-multiline">

          <div class="d-flex is-align-items-center is-justify-center"> 
            <div class="columns is-mobile is-tablet is-centered is-multiline">
              <!--CM-->  
              <div class=" d-flex flex-wrap">
                <div class="p-1 my-1 mx-1 has-background-black">
                  <Card class="py-5 px-3 has-background-white" style="max-width:250px;">
                           
                    <!--Image-->           
                      <figure class="my-3 image 4 by 6">
                        <img class="is-rounded" src="Member/Cm.jpg" alt="background" />
                      </figure>
                              
                    <!--Info name-->
                      <div>
                        <p class="has-text-centered fredokaone">
                          Charles Maverick Herrera
                          <br>
                          <small class="has-text-weight-normal is-family-secondary">
                            Technical Lead
                          </small>
                        </p>
                      </div>
      
                    <!--ICON-->
                      <div class="mt-3 is-flex is-justify-content-center">
                        <div class="mx-2">
                          <a href="https://www.facebook.com/SIEMCMSIEM" target="_blank">
                            <Icon class="has-text-info" size="32px" path={mdiFacebook} />
                          </a>
                        </div>
                        
                        <div class="mx-2">
                          <a class="is-clickable"on:click={openComingSoon}>
                            <Icon class="has-text-danger-dark" size="32px" path={mdiGoogle} />
                          </a>
                        </div>
                      </div>
                  </Card>
                </div>
              </div>
   
              <!--JOANNE-->
                <div class=" d-flex flex-wrap">
                  <div class="p-1 my-1 mx-1 has-background-black">
                    <Card class="py-5 px-3 has-background-white" style="max-width:250px;">
                             
                      <!--Image-->
                      <figure class="my-3 image 4 by 6">
                        <img class="is-rounded" src="Member/Joanne.jpg" alt="background" />
                      </figure>
                             
                      <!--info name-->
                      <div>
                        <p class="has-text-centered fredokaone">
                            Joanne Razelle L. Roche
                          <br>
                          <small class="has-text-weight-normal is-family-secondary">
                            Front-end Developer
                          </small>
                        </p>
                      </div>
   
                      <!--ICON-->
                      <div class="mt-3 is-flex is-justify-content-center">
                        <div class="mx-2">
                          <a href="https://www.facebook.com/joanne.roche19/" target="_blank">
                            <Icon class="has-text-info" size="32px" path={mdiFacebook} />
                          </a>
                        </div>
                               
                        <div class="mx-2">
                          <a class="is-clickable"on:click={openComingSoon}>
                            <Icon class="has-text-danger-dark" size="32px" path={mdiGoogle} />
                          </a>
                        </div>
                      </div>  
                    </Card>
                  </div>
                </div>
   
              <!--YAZEN-->
                <div class=" d-flex flex-wrap">
                  <div class="p-1 my-1 mx-1 has-background-black">
                    <Card class="py-5 px-3 has-background-white" style="max-width:250px;">
                             
                      <!--Image-->    
                      <figure class="my-3 image 4 by 6">
                        <img class="is-rounded" src="Member/Yazen.jpg" alt="background" />
                      </figure>
                             
                      <!--Info name-->
                        <div>
                          <p class="has-text-centered fredokaone">
                              Mart Yazen Mikhail Clarin
                            <br>
                            <small class="has-text-weight-normal is-family-secondary">
                              Quality Assurance, Research Lead
                            </small>
                          </p>
                        </div>
   
                      <!--ICON-->
                        <div class="mt-3 is-flex is-justify-content-center">
                          <div class="mx-2">
                            <a href="https://www.facebook.com/yazen.clarin" target="_blank">
                              <Icon class="has-text-info" size="32px" path={mdiFacebook} />
                            </a>
                          </div>

                          <div class="mx-2">
                            <a class="is-clickable"on:click={openComingSoon}>
                              <Icon class="has-text-danger-dark" size="32px" path={mdiGoogle} />
                            </a>
                          </div>
                        </div>
                    </Card>   
                  </div>
                </div>
   
                <!--ELJOHN-->
                  <div class=" d-flex flex-wrap">
                    <div class="p-1 my-1 mx-1 has-background-black">
                      <Card class="py-5 px-3 has-background-white" style="max-width:250px;">
                             
                        <!--Image-->  
                        <figure class="my-3 image 4 by 6">
                          <img class="is-rounded" src="Member/Eljohn.jpg" alt="background" />
                        </figure>
                             
                        <!--Info name-->   
                        <div>
                          <p class="has-text-centered fredokaone">
                              El John S. Matimtim
                            <br>
                            <small class="has-text-weight-normal is-family-secondary">
                              Quality Assurance Lead
                            </small>
                          </p>
                        </div>
   
                        <!--ICON-->
                          <div class="mt-3 is-flex is-justify-content-center">
                            <div class="mx-2">
                              <a href="https://www.facebook.com/el.john.756859" target="_blank">
                                <Icon class="has-text-info" size="32px" path={mdiFacebook} />
                              </a>
                            </div>

                            <div class="mx-2">
                              <a class="is-clickable"on:click={openComingSoon}>
                                <Icon class="has-text-danger-dark" size="32px" path={mdiGoogle} />
                              </a>
                            </div>
                          </div>  
                      </Card>
                    </div>
                  <div>
            </div>
          </div>
        </div>
    </div>
  </div>

    <div in:fade class="d-flex justify-center">
        <Card flat outlined class="column my-6 is-multiline is-mobile is-6 has-background-light">
            <div class="hero-head">
            <p class="is-size-2-tablet is-size-3-mobile fredokaone has-text-black has-text-weight-bold has-text-centered my-6">Contact Us</p>               
            </div>
    
            <div class="columns is-mobile is-centered is-multiline">
                <div class="column is-10-tablet is-7-mobile">
                        <div class="field">
                            <div class="control">
                                <input class="input" type="name" placeholder="Name">
                        </div>
                    </div>
                </div>
            </div>
    
            <div class="columns is-mobile is-centered is-multiline">
                <div class="column is-10-tablet is-7-mobile">
                    <div class="field">
                        <div class="control">
                            <input class="input" type="email" placeholder="Email">
                        </div>
                    </div>
                </div>
            </div>
    
            <div class="columns is-mobile is-centered is-multiline">
                <div class="column is-10-tablet is-7-mobile">
                    <div class="field">
                        <div class="control">
                            <textarea style="resize:none" class="textarea is-small is-size-5" placeholder="Message"></textarea>
                        </div>
                    </div>
                </div>
            </div>
              
            <div class="columns is-mobile is-centered is-multiline">
                <div class="column is-10-tablet is-7-mobile">
                    <CardActions class="is-flex is-justify-content-end">
                        <button class="button is-primary is-medium">Submit</button>
                    </CardActions>
                </div>
            </div>
        </Card>
</MaterialApp>
<HomeFooter/>
