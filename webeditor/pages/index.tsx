import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Modal from 'react-modal'

import { useState } from 'react'

import ReactFlow, {
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  Background,
  OnLoadParams,
} from 'react-flow-renderer'
import { TerraformAPIClient } from './terraform/Api'

const TerraformClient = new TerraformAPIClient('http://localhost:8080')

const onLoad = (reactFlowInstance: OnLoadParams) => {
  console.log('flow loaded:', reactFlowInstance)
  reactFlowInstance.fitView()
}

const initialElements = [
  {
    id: '1',
    type: 'input',
    data: {
      label: (
        <>
          Welcome to <strong>React Flow!</strong>
        </>
      ),
    },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: {
      label: (
        <>
          This is a <strong>default node</strong>
        </>
      ),
    },
    position: { x: 100, y: 100 },
  },
]

const testVar = 'asdadsa'

function SafeHydrate({ children }) {
  return <div suppressHydrationWarning>{typeof window === 'undefined' ? null : children}</div>
}

const Home: NextPage = () => {
  const [elements, setElements] = useState(initialElements)
  const onElementsRemove = (elementsToRemove: object) =>
    setElements(els => removeElements(elementsToRemove, els))
  const onConnect = params => setElements(els => addEdge(params, els))

  TerraformClient.getProvidersSchemas().then(console.log)
  TerraformClient.getState().then(console.log)

  return (
    <SafeHydrate>
      <div id="111" style={{ height: '100vh' }}>
        <ReactFlow
          elements={elements}
          onElementsRemove={onElementsRemove}
          onConnect={onConnect}
          onLoad={onLoad}
          snapToGrid={true}
          snapGrid={[15, 15]}
        >
          <MiniMap
            nodeStrokeColor={n => {
              if (n.style?.background) return n.style.background
              if (n.type === 'input') return '#0041d0'
              if (n.type === 'output') return '#ff0072'
              if (n.type === 'default') return '#1a192b'

              return '#eee'
            }}
            nodeColor={n => {
              if (n.style?.background) return n.style.background

              return '#fff'
            }}
            nodeBorderRadius={2}
          />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
        <Modal
          isOpen={true}
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
            },
          }}
        >
          test
        </Modal>
      </div>
    </SafeHydrate>
  )
}

export default Home
