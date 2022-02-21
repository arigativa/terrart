import React from "react";
import {TerraformAPI} from "../../../pages/terraform/Api";
import {SearchResult} from "../../../pages/terraform/Providers";
import ReactMarkdown from 'react-markdown'
import {Form, InputGroup, ListGroup} from "react-bootstrap";

interface Props {
    tfClient: TerraformAPI
    onComplete?: (r: SearchResult) => void;
}

interface State {
    searchResults: SearchResult[];
}

export class Search extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            searchResults: [],
        }
        this.search("");
    }

    search(query: string) {
        this.props.tfClient.searchComponents(query)
            .then(
                results => {
                    this.setState(prev => ({
                        searchResults: results
                    }))
                }
            )
    }

    onSelect(r: SearchResult) {
        console.log('seleceted ', r);
        if (this.props.onComplete) {
            this.props.onComplete(r);
        }
    }

    render() {
        return <Form>
            <InputGroup>
                <InputGroup.Text>@</InputGroup.Text>
                <Form.Control type={'text'} onInput={ev => this.search(ev.target.value)}/>
            </InputGroup>

            {(this.state.searchResults) ? (
                <ListGroup>
                    {this.state.searchResults.map(res => (
                        <ListGroup.Item key={res.type + res.name} onClick={_ => this.onSelect(res)}>
                            {res.name} ({res.type})
                            {(res.schema.block?.description) ? (
                                <>
                                    <br/>
                                    <ReactMarkdown>{res.schema.block?.description}</ReactMarkdown>
                                </>
                            ) : null}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                "Nothing found"
            )}
        </Form>
    }
}