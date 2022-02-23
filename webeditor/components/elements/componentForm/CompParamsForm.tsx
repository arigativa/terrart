import React, { useState } from 'react'
import { SchemaAttribute, SchemaBlock } from '../../../pages/terraform/Providers'
import ReactMarkdown from 'react-markdown'
import { Button, Col, Form, FormControl, FormLabel, ListGroup, Row } from 'react-bootstrap'
import { partition } from '../../../util/partition'
import { entries, MapEntry } from '../../../util/map-entries'

interface Params {
  schema: SchemaBlock
}

interface State {
  value: any
}

export function CompParamsForm(props: Params) {
  const schema = props.schema
  const [object, setObject] = useState({})

  const [presentFields, missingFields] = partition<MapEntry<SchemaAttribute>>(
    x => x.value.required || object.hasOwnProperty(x.key),
    entries(schema.attributes)
  )

  function addField(key: string) {
    updateField(key, '')
  }

  function updateField(key: string, newValue: any) {
    setObject({
      ...object,
      [key]: newValue,
    })
  }

  return (
    <Form>
      {schema.description && schema.description_kind ? (
        schema.description_kind == 'markdown' ? (
          <ReactMarkdown>{schema.description}</ReactMarkdown>
        ) : (
          <>{schema.description}</>
        )
      ) : null}

      {presentFields.map(field => {
        const fieldName = field.key

        return (
          <Row>
            <FormLabel column="sm" sm={3} className={'text-right'}>
              {fieldName}
            </FormLabel>
            <Col sm={9}>
              <FormControl
                value={object[fieldName]}
                onInput={ev => updateField(fieldName, ev.target.value)}
              />
            </Col>
          </Row>
        )
      })}

      {missingFields.map(field => {
        return (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => {
              addField(field.key)
            }}
          >
            {field.key}
          </Button>
        )
      })}

      <h3>Attributes</h3>
      <ListGroup>
        {entries(schema.attributes).map(({ key, value }, index) => {
          return (
            <ListGroup.Item>
              {key} {JSON.stringify(value)}
            </ListGroup.Item>
          )
        })}
      </ListGroup>

      <h3>Blocks</h3>
      <ListGroup>
        {entries(schema.block_types).map(({ key, value }, index) => {
          return (
            <ListGroup.Item>
              {key} {JSON.stringify(value)}
            </ListGroup.Item>
          )
        })}
      </ListGroup>
    </Form>
  )
}
