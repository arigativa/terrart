import {TerraformAPI} from "../../../pages/terraform/Api";
import {SchemaBlock, SearchResult} from "../../../pages/terraform/Providers";
import React from "react";
import {Search} from "./Search";
import {CompParamsForm} from "../../elements/componentForm/CompParamsForm";
import {Alert, Button, ModalBody, ModalDialog} from "react-bootstrap";
import ModalContext from "react-bootstrap/ModalContext";
import ModalHeader from "react-bootstrap/ModalHeader";

interface Props {
    tfClient: TerraformAPI
}

class StageError {
    kind: "error"
    message: string;
    constructor(message: string) {
        this.kind = "error";
        this.message = message;
    }
}

class StageSearch {
    kind: "search";
    constructor() {
        this.kind = "search";
    }
}

class StageFill {
    kind: "fill";
    schemaBlock: SchemaBlock;
    constructor(schemaBlock: SchemaBlock) {
        this.kind = "fill";
        this.schemaBlock = schemaBlock;
    }
}

interface State {
    stage: StageSearch | StageFill | StageError;
}

export class NewComponentDialog extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            stage: new StageSearch()
        };
    }

    onComponentChosen(result: SearchResult) {
        if (result.schema.block) {
            this.setState({
                stage: new StageFill(result.schema.block)
            });
        } else {
            this.setState({
                stage: new StageError("Selected resource don't have schema")
            })
        }
    }

    render() {
        let back;
        switch (this.state.stage.kind) {
            case 'search': back = null; break;
            case 'fill':
            case "error":
                back = () => {
                    this.setState({
                        stage: new StageSearch()
                    });
                };
                break;
        }

        return <div>
            <ModalDialog>
                <ModalHeader>
                    <Button variant='secondary' disabled={!back} onClick={back}>Back</Button>
                </ModalHeader>
                <ModalBody>
                    {
                        (() => {
                            switch (this.state.stage.kind) {
                                case 'search':
                                    return <Search tfClient={this.props.tfClient} onComplete={this.onComponentChosen.bind(this)} />
                                case 'fill':
                                    return <CompParamsForm schema={this.state.stage.schemaBlock} />;
                                case "error":
                                    return <Alert variant={'danger'}>{this.state.stage.message}</Alert>;
                            }
                        })()
                    }
                </ModalBody>
            </ModalDialog>
        </div>;
    }
}