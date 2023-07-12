import {IInputs, IOutputs} from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./src/App";

interface MyInputs extends IInputs {
    imageUrl: string;
}

export class WorkItemTree implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private container: HTMLDivElement;
    private imgElement:HTMLImageElement;
    private imageUrl: string;
    constructor() {}

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void {
        // this.imgElement = document.createElement("img");
		// context.resources.getResource("dots.png", this.setImage.bind(this, false, "png"), this.showError.bind(this));
		
		// container.appendChild(this.imgElement);

        this.container = container;
    }

    private setImage(shouldUpdateOutput:boolean, fileType: string, fileContent: string): void
	{
		// let imageUrl:string = this.generateImageSrcUrl(fileType, fileContent);
		// this.imgElement.src = imageUrl;
        // this.imageUrl = imageUrl;
        this.imageUrl = this.generateImageSrcUrl(fileType, fileContent);
        this.imgElement.src = this.imageUrl;
        console.log("=====mmm====> ", this.imageUrl);
        this.updateView();
        
	}

	private generateImageSrcUrl(fileType: string, fileContent: string): string
	{
		return  "data:image/" + fileType + ";base64, " + fileContent;
	}

    private showError(): void
	{
        console.log('error occur');
        
	}


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context?: ComponentFramework.Context<IInputs>): void {
        console.log('callllll');
        this.renderComponent();
        
        // if (this.imageUrl) {
        //   console.log("Image URL:", this.imageUrl);
        //   this.renderComponent();
        // }
      }
    
    private renderComponent(): void {
        ReactDOM.render(React.createElement(App, { imageUrl: this.imageUrl }), this.container);
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    // public getOutputs(): IOutputs
    // {
    //     return {};
    // }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
