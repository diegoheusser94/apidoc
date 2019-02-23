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

    private getPaths(tag: string): any[] {
        console.log(`searching path to tag: ${tag}`);
        let paths = [];
        Object.keys(this.data.paths).forEach(route => {
            Object.keys(this.data.paths[route]).forEach(method => {
                if (typeof this.data.paths[route][method] != 'undefined') {
                    const path = {
                        route: route,
                        method: method,
                        content: this.data.paths[route][method]
                    };
                    if (this.data.paths[route][method].tags.findIndex(value => value == tag) >= 0) {
                        paths.push(path);
                    }
                }
            });
        });
        console.log(`paths found`, paths);
        return paths;
    }

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
                            {this.data.tags.map(tag => 
                                <li>
                                    <a href={`#${tag.name}`}>{tag.name}</a>
                                    <ul>
                                        {this.getPaths(tag.name).map(path => 
                                            <li>
                                                <a href={`#${path.content.operationId}`}>{path.content.summary}</a>
                                            </li>
                                        )}
                                    </ul>
                                </li>
                            )}
                        </ul>
                    </nav>
                    <main>
                        {this.data.tags.map(tag => 
                            <div class="apidoc-tag" id={tag.name}>
                                <h2 class="apidoc-tag-name">{tag.name}</h2>
                                <p class="apidoc-tag-description">{tag.description != undefined ? tag.description : ''}</p>
                                <div class="apidoc-tag-externalDocs">
                                    {tag.externalDocs != undefined ? [
                                        (tag.externalDocs.description != undefined ? tag.externalDocs.description + ' ' : ' '),
                                        (tag.externalDocs.url != undefined ? <a href={tag.externalDocs.url}>{tag.externalDocs.url}</a>: '')
                                    ] : ''}
                                </div>
                                <div class="apidoc-paths">
                                    {this.getPaths(tag.name).map(path => 
                                        <div class="apidoc-path" id={path.content.operationId}>
                                            <div class="apidoc-path-content">
                                                <div class="path-content-header">
                                                    <h3 class="content-header-summary">{path.content.summary}</h3>
                                                    <span class="content-header-method">{path.method}</span>
                                                    <span class="content-header-route">{path.route}</span>
                                                </div>
                                                {path.content.description != undefined ?
                                                    <div class="path-content-description">{path.content.description}</div>
                                                : ''}
                                                {path.content.parameters != undefined ? 
                                                    <div class="path-content-parameters">
                                                        <h4>Parameters</h4>
                                                        <dl>
                                                            {path.content.parameters.map(parameter => [
                                                                <dt>{parameter.name}</dt>,
                                                                <dl>
                                                                    <span class="content-parameter-required">
                                                                        ({parameter.required != undefined ? parameter.required ? 'required' : 'optinal' : 'option'})
                                                                    </span>
                                                                    {parameter.schema != undefined ? [
                                                                        (parameter.schema.type != undefined ? (
                                                                            <span class="content-parameter-type">({parameter.schema.type})</span>
                                                                        ) : '')
                                                                    ] : ''}
                                                                    <p class="content parameter-description">{parameter.description != undefined ? parameter.description : ''}</p>
                                                                </dl>
                                                            ])}
                                                        </dl>
                                                    </div>
                                                : ''}
                                            </div>
                                            <div class="apidoc-path-example"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            :
                <div>loading</div> 
        );
    }

}