import { Component, Prop, State } from '@stencil/core';

@Component({
    tag: 'api-doc',
    styleUrl: 'apidoc.css',
    shadow: true
})
export class ApiDoc {

    @Prop() src: string;
    
    @State() data: any;

    private dataIsLoaded: boolean = false;

    componentWillLoad() {
        console.log('component will load');
        console.log(`loading ${this.src}`)
        fetch(this.src)
            .then(response => response.json())
            .then(json => {
                console.log(`loaded ${this.src}`, json)
                this.dataIsLoaded = true;
                this.data = json;
            })
            .catch(reason => console.error(`failed to load ${this.src}`, reason));
    }

    render() {
        console.log('rendering component');
        return (
            this.dataIsLoaded ? 
                <div>
                    <nav>
                        <ul>
                            {/* TODO */}
                        </ul>
                    </nav>
                </div>
            :
                <div>loading</div> 
        );
    }

}