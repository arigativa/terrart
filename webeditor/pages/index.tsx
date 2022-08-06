import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Modal from 'react-modal'

import { useState } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'

import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background, Edge, Node, ReactFlowInstance,
} from 'react-flow-renderer'
import { TerraformAPIClient } from '../model/terraform/Client'
import { ProvidersControl } from '../components/elements/ProvidersControl/ProvidersControl'

const TerraformClient = new TerraformAPIClient('http://localhost:8080')

const onFlowInit = (reactFlowInstance: ReactFlowInstance) => {
  console.log('flow loaded:', reactFlowInstance)
  reactFlowInstance.fitView()
}


function SafeHydrate({ children }) {
  return <div suppressHydrationWarning>{typeof window === 'undefined' ? null : children}</div>
}

const Home: NextPage = () => {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([]);
  // const onElementsRemove = (elementsToRemove: object) =>
  //   setElements(els => removeElements(elementsToRemove, els))
  // const onConnect = params => setElements(els => addEdge(params, els))

  TerraformClient.getProvidersSchemas().then(console.log)
  TerraformClient.getState().then(console.log)
  TerraformClient.getConfig().then(console.log)

  // TerraformClient.getConfig().then(
  //
  // )

  return (
    <SafeHydrate>
      <div id="111" style={{ height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          // onConnect={onConnect}
          onInit={onFlowInit}
          snapToGrid={true}
          snapGrid={[15, 15]}
        >
          <MiniMap
            nodeStrokeColor={(n) => {
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

          {/*<ProvidersControl />*/}
        </ReactFlow>
        {/*<Modal*/}
        {/*  isOpen={true}*/}
        {/*  style={{*/}
        {/*    content: {*/}
        {/*      top: '50%',*/}
        {/*      left: '50%',*/}
        {/*      right: 'auto',*/}
        {/*      bottom: 'auto',*/}
        {/*      marginRight: '-50%',*/}
        {/*      transform: 'translate(-50%, -50%)',*/}
        {/*      zIndex: 1000,*/}
        {/*    },*/}
        {/*  }}*/}
        {/*>*/}
        {/*  test*/}
        {/*</Modal>*/}
      </div>
    </SafeHydrate>
  )
}

export default Home
