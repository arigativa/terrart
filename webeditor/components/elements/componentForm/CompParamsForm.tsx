import React from "react";
import {SchemaAttribute, SchemaBlock} from "../../../pages/terraform/Providers";
import ReactMarkdown from "react-markdown";
import {ListGroup} from "react-bootstrap";

interface Params {
    schema: SchemaBlock;
}

interface MapEntry<T> {
    key: string;
    value: T;
}

function entries<T>(map?: { [key: string]: T }): MapEntry<T>[] {
    const result = [];
    if (map) {
        for (let k in map) {
            if (map.hasOwnProperty(k)) {
                result.push({key: k, value: map[k]});
            }
        }
    }
    return result;
}

export class CompParamsForm extends React.Component<Params, any> {

    constructor(params: Params) {
        super(params);
    }

    render() {
        const schema = this.props.schema;
        return (
            <div>
                {
                    (schema.description && schema.description_kind) ? (
                        (schema.description_kind == 'markdown')
                            ? <ReactMarkdown>{schema.description}</ReactMarkdown>
                            : <>{schema.description}</>
                    ) : null
                }

                <h3>Attributes</h3>
                <ListGroup>
                    {
                        entries(schema.attributes).map(({key, value}, index) => {
                            return <ListGroup.Item>
                                {key} {JSON.stringify(value)}
                            </ListGroup.Item>
                        })
                    }
                </ListGroup>

                <h3>Blocks</h3>
                <ListGroup>
                    {
                        entries(schema.block_types).map(({key, value}, index) => {
                            return <ListGroup.Item>
                                {key} {JSON.stringify(value)}
                            </ListGroup.Item>
                        })
                    }
                </ListGroup>
            </div>
        );
    }
}