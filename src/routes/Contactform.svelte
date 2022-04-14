<script>
    import { Card, CardActions, MaterialApp } from "svelte-materialify";
    import HomeHeader from "$lib/components/Home-header.svelte";
    import HomeFooter from "$lib/components/Home-footer.svelte";

    // Transitions
    import {fade} from 'svelte/transition';
</script>

<HomeHeader/>
<MaterialApp>
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
    </div>
</MaterialApp>
<HomeFooter/>
