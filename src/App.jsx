import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import ReactFlow, { ReactFlowProvider, addEdge, useNodesState, useEdgesState, Controls } from "react-flow-renderer";

import Sidebar from "./Sidebar";
import CameraNode from "./CameraNode";

import "./index.css";

let id = 0;
const getId = () => `dndnode_${id++}`;

const App = () => {
	const onChange = (event, varname, id) => {
		setNodes((nds) =>
			nds.map((node) => {
				console.log("DATA: ", varname, id);
				let d = { ...node.data };
				d[varname] = event.target.value;
				console.log("D: ", d);
				if (node.id === id) {
					return {
						...node,
						data: d,
					};
				}
			})
		);
	};

	const initialNodes = [
		{
			id: "1",
			type: "camera",
			data: { onChange: onChange, label: "camera node", selectedCamera: "" },
			position: { x: 250, y: 5 },
		},
	];
	const reactFlowWrapper = useRef(null);
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [reactFlowInstance, setReactFlowInstance] = useState(null);
	const [selectedCamera, setSelectedCamera] = useState();
	const nodeTypes = useMemo(() => ({ camera: CameraNode }), []);

	// useEffect(() => {
	// 	console.log("NODES: ", nodes, " EDGES: ", edges);
	// }, [nodes, edges]);

	const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

	const onDragOver = useCallback((event) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}, []);

	const onDrop = useCallback(
		(event) => {
			event.preventDefault();

			const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
			const type = event.dataTransfer.getData("application/reactflow");

			// check if the dropped element is valid
			if (typeof type === "undefined" || !type) {
				return;
			}

			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			});
			const newNode = {
				id: getId(),
				type,
				position,
				data: { onChange: onChange, label: `${type} node`, selectedCamera: "" },
			};

			setNodes((nds) => nds.concat(newNode));
		},
		[reactFlowInstance]
	);

	return (
		<div className="dndflow">
			<ReactFlowProvider>
				<div className="reactflow-wrapper" ref={reactFlowWrapper}>
					<ReactFlow
						nodes={nodes}
						edges={edges}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onConnect={onConnect}
						onInit={setReactFlowInstance}
						onDrop={onDrop}
						onDragOver={onDragOver}
						nodeTypes={nodeTypes}
						style={{ width: "100%", height: window.innerHeight }}
						fitView
					>
						<Controls />
					</ReactFlow>
				</div>
				<Sidebar />
			</ReactFlowProvider>
		</div>
	);
};

export default App;
