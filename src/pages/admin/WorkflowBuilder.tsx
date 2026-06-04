import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  type Connection,
  MiniMap,
  Panel,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import workflowService, { type WorkflowData } from "../../services/workflowService";
import positionService, { type PositionType } from "../../services/positionService";

/* ================= CUSTOM EDGE COMPONENT ================= */
const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, style, markerEnd }: any) => {
  const edgePath = `M ${sourceX} ${sourceY} C ${sourceX} ${(sourceY + targetY) / 2}, ${targetX} ${(sourceY + targetY) / 2}, ${targetX} ${targetY}`;
  
  const edgeColors: Record<string, string> = {
    approval: "#3b82f6",
    reject: "#ef4444",
    conditional: "#10b981",
    parallel: "#f59e0b",
    default: "#6b7280"
  };
  
  const edgeColor = edgeColors[data?.type || "default"];
  const edgeWidth = data?.type === "reject" ? 3 : 2;
  const edgeDash = data?.type === "reject" ? "5,5" : data?.type === "conditional" ? "8,4" : "none";
  
  return (
    <>
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={edgeColor}
        strokeWidth={edgeWidth}
        strokeDasharray={edgeDash}
        markerEnd={markerEnd}
      />
      {data?.label && (
        <text>
          <textPath href={`#${id}`} startOffset="50%" textAnchor="middle" style={{ fontSize: 11, fill: edgeColor, fontWeight: 500 }}>
            {data.label}
          </textPath>
        </text>
      )}
    </>
  );
};

const edgeTypes = {
  custom: CustomEdge,
};

/* ================= CUSTOM NODE COMPONENT ================= */
const CustomNode = ({ data, selected }: any) => {
  const getColor = (label: string) => {
    if (label === "START") return "#10b981";
    if (label === "END") return "#ef4444";
    if (label === "APPROVAL") return "#3b82f6";
    return "#6b7280";
  };

  const getIcon = (label: string) => {
    if (label === "START") return "🚀";
    if (label === "END") return "🏁";
    if (label === "APPROVAL") return "✓";
    return "📋";
  };

  return (
    <div
      style={{
        padding: "12px 20px",
        borderRadius: 12,
        background: selected ? "#fef3c7" : "#fff",
        border: `2px solid ${getColor(data.label)}`,
        boxShadow: selected 
          ? "0 0 0 2px #f59e0b, 0 4px 12px rgba(0,0,0,0.15)" 
          : "0 4px 10px rgba(0,0,0,0.1)",
        minWidth: 140,
        textAlign: "center",
        fontWeight: 600,
        position: "relative",
        transition: "all 0.2s",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: "#3b82f6", width: 10, height: 10 }} />
      
      <div style={{ fontSize: 24, marginBottom: 4 }}>{getIcon(data.label)}</div>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{data.label}</div>
      
      {data.assignedRole && (
        <div style={{ 
          fontSize: "11px", 
          marginTop: 8, 
          padding: "2px 8px",
          background: "#e0e7ff",
          borderRadius: 20,
          color: "#4338ca",
          fontWeight: 500,
          display: "inline-block",
        }}>
          👤 {data.assignedRole}
        </div>
      )}
      
      {data.description && (
        <div style={{ 
          fontSize: "10px", 
          marginTop: 6, 
          color: "#6b7280",
          fontStyle: "italic",
        }}>
          {data.description}
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} style={{ background: "#3b82f6", width: 10, height: 10 }} />
    </div>
  );
};

const nodeTypes = { default: CustomNode };

/* ================= MAIN COMPONENT ================= */
export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedEdge, setSelectedEdge] = useState<any>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const [workflows, setWorkflows] = useState<any[]>([]);
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string>("");
  const [workflowName, setWorkflowName] = useState<string>("");
  const [workflowDescription, setWorkflowDescription] = useState<string>("");

  // State cho chức vụ (positions) - lấy từ BE
 const [positions, setPositions] = useState<PositionType[]>([]);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const [showAddPositionModal, setShowAddPositionModal] = useState(false);
  const [newPositionName, setNewPositionName] = useState("");

  const [showSidebar, setShowSidebar] = useState(true);
  const [showProperties, setShowProperties] = useState(true);
  
  const [edgeType, setEdgeType] = useState("approval");
  const [edgeLabel, setEdgeLabel] = useState("");
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; edgeId: string | null } | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSwitchingWorkflow, setIsSwitchingWorkflow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  /* ================= LOAD POSITIONS FROM BACKEND ================= */
const loadPositions = async () => {
  setPositionsLoading(true);
  try {
    const positionsFromBE = await positionService.getAllPositions();
    console.log("📋 Positions from BE:", positionsFromBE);
    setPositions(positionsFromBE);
  } catch (err: any) {
    console.error("Load positions error:", err);
  } finally {
    setPositionsLoading(false);
  }
};

  /* ================= ADD POSITION ================= */
const handleAddPosition = async () => {
  if (!newPositionName.trim()) {
    alert("Vui lòng nhập tên chức vụ");
    return;
  }

  try {
    await positionService.createPosition({ positionName: newPositionName.trim() });
    console.log("✅ Created position");
    await loadPositions();
    setShowAddPositionModal(false);
    setNewPositionName("");
    alert("Thêm chức vụ thành công!");
  } catch (err: any) {
    console.error("Add position error:", err);
    alert(err.message || "Thêm chức vụ thất bại");
  }
};

  /* ================= DELETE POSITION ================= */
  const handleDeletePosition = async (positionId: string, positionName: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa chức vụ "${positionName}"?`)) return;

    try {
      await positionService.deletePosition(positionId);
      console.log("✅ Deleted position:", positionId);
      await loadPositions();
      
      // Xóa chức vụ khỏi các node nếu đang được sử dụng
      setNodes((nds) =>
        nds.map((n) =>
          n.data.assignedRole === positionName
            ? { ...n, data: { ...n.data, assignedRole: "" } }
            : n
        )
      );
      
      alert("Xóa chức vụ thành công!");
    } catch (err: any) {
      console.error("Delete position error:", err);
      alert(err.message || "Xóa chức vụ thất bại");
    }
  };

  /* ================= LOAD WORKFLOWS FROM BACKEND ================= */
  const loadWorkflowsFromBackend = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const workflowsFromBE = await workflowService.getAllWorkflows();
      console.log('📋 Workflows from BE:', workflowsFromBE);
      
      localStorage.removeItem('workflows');
      
      setWorkflows(workflowsFromBE);
      
      if (workflowsFromBE.length > 0 && !currentWorkflowId) {
        const firstWorkflow = workflowsFromBE[0];
        setCurrentWorkflowId(firstWorkflow.workflowId);
        setWorkflowName(firstWorkflow.name);
        setWorkflowDescription(firstWorkflow.description || "");
        setNodes(firstWorkflow.nodes || []);
        setEdges(firstWorkflow.edges || []);
      }
    } catch (error: any) {
      console.error('Load workflows error:', error);
      setError('Không thể tải dữ liệu từ server');
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= UPDATE WORKFLOW STATUS ================= */
  const updateWorkflowStatus = async (workflowId: string, newStatus: 'active' | 'inactive') => {
    setIsUpdatingStatus(true);
    try {
      const updatedWorkflow = await workflowService.updateWorkflowStatus(workflowId, newStatus);
      console.log(`✅ Updated workflow ${workflowId} status to: ${newStatus}`);
      
      setWorkflows(prev => prev.map(w => 
        w.workflowId === workflowId ? { ...w, status: newStatus } : w
      ));
      
      const saveIndicator = document.getElementById("save-indicator");
      if (saveIndicator) {
        saveIndicator.style.background = "#10b981";
        saveIndicator.style.opacity = "1";
        saveIndicator.textContent = `✅ Đã ${newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa'} workflow!`;
        setTimeout(() => {
          saveIndicator.style.opacity = "0";
        }, 2000);
      }
      
      return updatedWorkflow;
    } catch (error: any) {
      console.error('Update status error:', error);
      setError(error.message || 'Cập nhật trạng thái thất bại');
      
      const saveIndicator = document.getElementById("save-indicator");
      if (saveIndicator) {
        saveIndicator.style.background = "#ef4444";
        saveIndicator.style.opacity = "1";
        saveIndicator.textContent = "❌ Cập nhật thất bại!";
        setTimeout(() => {
          saveIndicator.style.opacity = "0";
        }, 2000);
      }
      
      throw error;
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  /* ================= SAVE TO SERVER ================= */
  const saveToServer = async () => {
    const isValid = validateWorkflow();
    if (!isValid) return false;
    
    setIsSaving(true);
    setError(null);
    
    try {
      const workflowData: WorkflowData = {
        name: workflowName,
        description: workflowDescription,
        nodes: nodes.map(node => ({
          id: node.id,
          position: node.position,
          data: {
            label: node.data.label,
            assignedRole: node.data.assignedRole || '',
            description: node.data.description || ''
          },
          type: node.type || 'default'
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.type || 'custom',
          animated: edge.animated || false,
          data: edge.data || {},
          style: edge.style,
          markerEnd: edge.markerEnd
        })),
        status: 'draft',
        version: 1,
        workflowId: ""
      };
      
      let savedWorkflow: WorkflowData;
      const existingWorkflow = workflows.find(w => w.workflowId === currentWorkflowId);
      
      if (existingWorkflow) {
        savedWorkflow = await workflowService.updateWorkflow(currentWorkflowId, workflowData);
        setWorkflows(prev => prev.map(w => 
          w.workflowId === currentWorkflowId 
            ? { ...savedWorkflow, status: w.status }
            : w
        ));
      } else {
        savedWorkflow = await workflowService.createWorkflow(workflowData);
        setWorkflows(prev => [...prev, savedWorkflow]);
      }
      
      setCurrentWorkflowId(savedWorkflow.workflowId);
      setWorkflowName(savedWorkflow.name);
      setWorkflowDescription(savedWorkflow.description || "");
      
      const saveIndicator = document.getElementById("save-indicator");
      if (saveIndicator) {
        saveIndicator.style.background = "#10b981";
        saveIndicator.style.opacity = "1";
        saveIndicator.textContent = "✅ Đã lưu lên server!";
        setTimeout(() => {
          saveIndicator.style.opacity = "0";
          saveIndicator.textContent = "💾 Đã lưu";
        }, 2000);
      }
      
      return true;
    } catch (error: any) {
      console.error('Save workflow error:', error);
      setError(error.message || 'Lưu workflow thất bại');
      
      const saveIndicator = document.getElementById("save-indicator");
      if (saveIndicator) {
        saveIndicator.style.background = "#ef4444";
        saveIndicator.style.opacity = "1";
        saveIndicator.textContent = "❌ Lưu thất bại!";
        setTimeout(() => {
          saveIndicator.style.opacity = "0";
          saveIndicator.textContent = "💾 Đã lưu";
        }, 2000);
      }
      
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  /* ================= CREATE NEW WORKFLOW ================= */
  const createNewWorkflow = async () => {
    try {
      const newWorkflow = {
        name: `Quy trình mới ${workflows.length + 1}`,
        description: `Workflow được tạo ngày ${new Date().toLocaleString()}`,
        nodes: [],
        edges: [],
        status: 'draft' as const,
        version: 1
      };
      
      const created = await workflowService.createWorkflow(newWorkflow);
      console.log('✅ Created workflow:', created);
      await loadWorkflowsFromBackend();
      
      if (created.workflowId) {
        await loadWorkflow(created.workflowId);
      }
    } catch (error) {
      console.error('Create workflow error:', error);
      setError('Không thể tạo workflow mới');
    }
  };

  /* ================= LOAD WORKFLOW ================= */
  const loadWorkflow = async (workflowId: string) => {
    if (workflowId === currentWorkflowId) return;
    
    console.log('🔄 Switching to workflow:', workflowId);
    setIsSwitchingWorkflow(true);
    
    try {
      const workflow = await workflowService.getWorkflowById(workflowId);
      console.log('📦 Workflow data:', workflow);
      
      if (workflow) {
        setCurrentWorkflowId(workflow.workflowId);
        setWorkflowName(workflow.name);
        setWorkflowDescription(workflow.description || "");
        
        const safeNodes = Array.isArray(workflow.nodes) ? workflow.nodes : [];
        
        let safeEdges: any[] = [];
        if (Array.isArray(workflow.edges)) {
          safeEdges = workflow.edges.map((edge: any, index: number) => ({
            ...edge,
            id: edge.id || `${edge.source}-${edge.target}-${index}`
          }));
        } else if (workflow.edges && typeof workflow.edges === 'object') {
          safeEdges = Object.values(workflow.edges).map((edge: any, index: number) => ({
            ...edge,
            id: edge.id || `${edge.source}-${edge.target}-${index}`
          }));
        }
        
        setNodes(safeNodes);
        setEdges(safeEdges);
        
        console.log('✅ Switched to workflow:', workflow.name);
      }
    } catch (error) {
      console.error('Load workflow error:', error);
      setError('Không thể tải workflow');
    } finally {
      setIsSwitchingWorkflow(false);
    }
  };

  /* ================= DELETE WORKFLOW ================= */
  const deleteWorkflow = async (workflowId: string) => {
    if (workflows.length === 1) {
      alert("⚠️ Phải giữ lại ít nhất 1 workflow!");
      return;
    }
    
    const workflowToDelete = workflows.find(w => w.workflowId === workflowId);
    if (!window.confirm(`Bạn có chắc muốn xóa workflow "${workflowToDelete?.name}"?`)) return;
    
    try {
      await workflowService.deleteWorkflow(workflowId);
      await loadWorkflowsFromBackend();
      alert("✅ Xóa workflow thành công!");
    } catch (error) {
      console.error('Delete workflow error:', error);
      setError('Xóa workflow thất bại');
      alert("❌ Xóa workflow thất bại!");
    }
  };

  /* ================= RENAME WORKFLOW ================= */
  const renameWorkflow = async (workflowId: string, newName: string, oldName: string) => {
    if (!newName.trim()) {
      setWorkflows(prev => prev.map(w => 
        w.workflowId === workflowId ? { ...w, name: oldName } : w
      ));
      if (currentWorkflowId === workflowId) {
        setWorkflowName(oldName);
      }
      return;
    }
    
    try {
      await workflowService.updateWorkflow(workflowId, { name: newName });
      console.log(`✅ Renamed workflow to: ${newName}`);
      
      const saveIndicator = document.getElementById("save-indicator");
      if (saveIndicator) {
        saveIndicator.style.background = "#10b981";
        saveIndicator.style.opacity = "1";
        saveIndicator.textContent = "✅ Đã đổi tên workflow!";
        setTimeout(() => {
          saveIndicator.style.opacity = "0";
        }, 1500);
      }
    } catch (error) {
      console.error('Rename workflow error:', error);
      setError('Đổi tên thất bại');
      
      setWorkflows(prev => prev.map(w => 
        w.workflowId === workflowId ? { ...w, name: oldName } : w
      ));
      if (currentWorkflowId === workflowId) {
        setWorkflowName(oldName);
      }
    }
  };

  /* ================= UPDATE WORKFLOW DESCRIPTION ================= */
  const updateWorkflowDescription = async (description: string) => {
    try {
      await workflowService.updateWorkflow(currentWorkflowId, { description });
      setWorkflowDescription(description);
      setWorkflows(prev => prev.map(w => 
        w.workflowId === currentWorkflowId ? { ...w, description: description } : w
      ));
      console.log(`✅ Updated workflow description`);
    } catch (error) {
      console.error('Update description error:', error);
      setError('Cập nhật mô tả thất bại');
    }
  };

  /* ================= NODE OPERATIONS ================= */
  const updateNodeData = (field: string, value: any) => {
    if (!selectedNode) return;
    
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id
          ? { ...n, data: { ...n.data, [field]: value } }
          : n
      )
    );
    
    setSelectedNode((prev: any) => ({
      ...prev,
      data: { ...prev.data, [field]: value },
    }));
  };

  const deleteNode = () => {
    if (!selectedNode) return;
    if (!window.confirm(`Xóa node "${selectedNode.data.label}"?`)) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setSelectedNode(null);
  };

  /* ================= EDGE OPERATIONS ================= */
  const onConnect = useCallback(
    (params: Connection) => {
      const edgeColors: Record<string, string> = {
        approval: "#3b82f6",
        reject: "#ef4444",
        conditional: "#10b981",
        parallel: "#f59e0b",
      };
      
      const edgeDasharrays: Record<string, string> = {
        approval: "none",
        reject: "5,5",
        conditional: "8,4",
        parallel: "none",
      };
      
      const newEdge = {
        ...params,
        id: `edge_${Date.now()}`,
        type: "custom",
        animated: edgeType !== "reject",
        data: {
          type: edgeType,
          label: edgeLabel || (edgeType === "approval" ? "Đồng ý" : edgeType === "reject" ? "Từ chối" : "Điều kiện"),
        },
        style: {
          stroke: edgeColors[edgeType],
          strokeWidth: edgeType === "reject" ? 3 : 2,
          strokeDasharray: edgeDasharrays[edgeType],
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColors[edgeType],
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      setEdgeLabel("");
      setIsConnecting(false);
    },
    [setEdges, edgeType, edgeLabel]
  );

  const updateEdge = useCallback((edgeId: string, updates: any) => {
    setEdges((eds) =>
      eds.map((e) =>
        e.id === edgeId
          ? { ...e, data: { ...e.data, ...updates } }
          : e
      )
    );
    if (selectedEdge?.id === edgeId) {
      setSelectedEdge((prev: any) => ({
        ...prev,
        data: { ...prev.data, ...updates },
      }));
    }
  }, [setEdges, selectedEdge]);

  const deleteEdge = useCallback((edgeId: string) => {
    if (window.confirm("Xóa connection này?")) {
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
      if (selectedEdge?.id === edgeId) {
        setSelectedEdge(null);
      }
      setContextMenu(null);
    }
  }, [setEdges, selectedEdge]);

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: any) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: any) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      edgeId: edge.id,
    });
    setSelectedEdge(edge);
  }, []);

  const onEdgeDoubleClick = useCallback((event: React.MouseEvent, edge: any) => {
    setSelectedEdge(edge);
  }, []);

  /* ================= DRAG & DROP ================= */
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData("nodeType");
    if (!nodeType) return;

    const bounds = (e.target as HTMLElement).getBoundingClientRect();
    const position = reactFlowInstance?.project({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    });

    const newNode = {
      id: `node_${Date.now()}`,
      position: position || { x: e.clientX - bounds.left, y: e.clientY - bounds.top },
      data: { 
        label: nodeType, 
        assignedRole: "",
        description: ""
      },
      type: "default",
    };
    setNodes((nds) => [...nds, newNode]);
  };

  /* ================= VALIDATION ================= */
  const validateWorkflow = () => {
    const hasStart = nodes.some((n) => n.data.label === "START");
    const hasApproval = nodes.some((n) => n.data.label === "APPROVAL");
    const hasEnd = nodes.some((n) => n.data.label === "END");
    
    if (!hasStart) {
      alert("⚠️ Quy trình phải có node START!");
      return false;
    }
    if (!hasApproval) {
      alert("⚠️ Quy trình phải có ít nhất 1 node APPROVAL!");
      return false;
    }
    if (!hasEnd) {
      alert("⚠️ Quy trình phải có node END!");
      return false;
    }
    
    const nodesWithoutRole = nodes.filter(
      (n) => n.data.label === "APPROVAL" && !n.data.assignedRole
    );
    if (nodesWithoutRole.length > 0) {
      alert(`⚠️ Có ${nodesWithoutRole.length} node APPROVAL chưa được gán chức vụ!`);
      return false;
    }
    
    const connectionsBySource: Record<string, Array<{ target: string; type: string }>> = {};
    
    edges.forEach((edge) => {
      if (!connectionsBySource[edge.source]) {
        connectionsBySource[edge.source] = [];
      }
      const connectionType = edge.data?.type || "approval";
      connectionsBySource[edge.source].push({
        target: edge.target,
        type: connectionType
      });
    });
    
    const invalidSourceNodes: string[] = [];
    
    for (const [sourceId, connections] of Object.entries(connectionsBySource)) {
      if (connections.length <= 1) continue;
      
      const uniqueTypes = new Set(connections.map(c => c.type));
      
      if (uniqueTypes.size > 1) {
        const sourceNode = nodes.find((n) => n.id === sourceId);
        const nodeName = sourceNode?.data?.label || sourceId;
        invalidSourceNodes.push(nodeName);
      }
    }
    
    if (invalidSourceNodes.length > 0) {
      alert(`⚠️ LỖI: Các node sau có nhiều loại connection khác nhau đến các node con!\nYêu cầu: Trong cùng 1 bước, tất cả connection phải cùng loại!`);
      return false;
    }
    
    const buildGraph = () => {
      const graph: Record<string, string[]> = {};
      nodes.forEach((node) => {
        graph[node.id] = [];
      });
      edges.forEach((edge) => {
        if (graph[edge.source]) {
          graph[edge.source].push(edge.target);
        }
      });
      return graph;
    };
    
    const canReachEnd = (startId: string, endIds: string[]): boolean => {
      const graph = buildGraph();
      const visited = new Set<string>();
      const queue = [startId];
      
      while (queue.length > 0) {
        const current = queue.shift()!;
        if (endIds.includes(current)) return true;
        if (visited.has(current)) continue;
        visited.add(current);
        
        const neighbors = graph[current] || [];
        neighbors.forEach((neighbor) => {
          if (!visited.has(neighbor)) {
            queue.push(neighbor);
          }
        });
      }
      return false;
    };
    
    const startNodeIds = nodes.filter((n) => n.data.label === "START").map((n) => n.id);
    const endNodeIds = nodes.filter((n) => n.data.label === "END").map((n) => n.id);
    
    for (const startId of startNodeIds) {
      if (!canReachEnd(startId, endNodeIds)) {
        alert(`⚠️ Không có đường đi từ node START đến bất kỳ node END nào!`);
        return false;
      }
    }
    
    alert("✅ Quy trình hợp lệ!");
    return true;
  };

  /* ================= EXPORT/IMPORT ================= */
  const exportWorkflow = () => {
    const workflow = workflows.find((w) => w.workflowId === currentWorkflowId);
    if (!workflow) return;
    
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataUri = "data:application/json;charset=utf-8,"+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${workflow.name}.json`;
    
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const importWorkflow = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const importedWorkflow = JSON.parse(evt.target?.result as string);
        const newWorkflow = {
          name: `${importedWorkflow.name} (Imported)`,
          description: `Nhập từ file ngày ${new Date().toLocaleString()}`,
          nodes: importedWorkflow.nodes || [],
          edges: importedWorkflow.edges || [],
          status: 'draft' as const,
          version: 1
        };
        
        await workflowService.createWorkflow(newWorkflow);
        await loadWorkflowsFromBackend();
        alert("✅ Import workflow thành công!");
      } catch (error) {
        console.error('Import error:', error);
        alert("❌ File không hợp lệ!");
      }
    };
    reader.readAsText(file);
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    loadWorkflowsFromBackend();
    loadPositions();
  }, []);

  /* ================= RENDER ================= */
  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "91.5vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 16 }}>⏳</div>
          <div>Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "91.5vh", overflow: "hidden", fontFamily: "sans-serif" }}>
      {/* LEFT SIDEBAR */}
      <div
        style={{
          width: showSidebar ? 280 : 50,
          transition: "0.3s",
          background: "linear-gradient(135deg, #1e1e2f 0%, #2d2d44 100%)",
          color: "#fff",
          padding: showSidebar ? 16 : 8,
          overflowY: "auto",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        }}
      >
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          style={{
            width: "100%",
            padding: 8,
            background: "#3b82f6",
            border: "none",
            borderRadius: 8,
            color: "white",
            cursor: "pointer",
            marginBottom: 12,
          }}
        >
          {showSidebar ? "◀ Đóng" : "Mở ▶"}
        </button>

        {showSidebar && (
          <>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ margin: 0, marginBottom: 8 }}>📋 Quy trình</h3>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <button
                  onClick={createNewWorkflow}
                  style={{
                    flex: 1,
                    padding: 8,
                    background: "#10b981",
                    border: "none",
                    borderRadius: 6,
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  + Mới
                </button>
                <button
                  onClick={exportWorkflow}
                  style={{
                    flex: 1,
                    padding: 8,
                    background: "#f59e0b",
                    border: "none",
                    borderRadius: 6,
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  📤 Export
                </button>
              </div>
              <label style={{ fontSize: 12, cursor: "pointer", display: "block", marginBottom: 8 }}>
                📥 Import: 
                <input type="file" accept=".json" onChange={importWorkflow} style={{ marginLeft: 8, fontSize: 11 }} />
              </label>
            </div>

            {isSwitchingWorkflow && (
              <div style={{ padding: 8, background: "#f59e0b", borderRadius: 6, marginBottom: 12, textAlign: "center", fontSize: 12 }}>
                🔄 Đang chuyển quy trình...
              </div>
            )}

            <div style={{ maxHeight: 300, overflowY: "auto", marginBottom: 20 }}>
              {workflows.map((wf) => (
                <div
                  key={wf.workflowId}
                  onClick={() => loadWorkflow(wf.workflowId)}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    marginBottom: 8,
                    cursor: "pointer",
                    background: wf.workflowId === currentWorkflowId ? "#3b82f6" : "#2e2e42",
                    transition: "0.2s",
                    opacity: isSwitchingWorkflow ? 0.6 : 1,
                    pointerEvents: isSwitchingWorkflow ? "none" : "auto",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                      <input
                        type="text"
                        value={wf.name}
                        onClick={(e) => e.stopPropagation()}
                        onChange={async (e) => {
                          const newName = e.target.value;
                          const oldName = wf.name;
                          
                          setWorkflows(prev => prev.map(w => 
                            w.workflowId === wf.workflowId ? { ...w, name: newName } : w
                          ));
                          
                          if (currentWorkflowId === wf.workflowId) {
                            setWorkflowName(newName);
                          }
                          
                          await renameWorkflow(wf.workflowId, newName, oldName);
                        }}
                        style={{
                          flex: 1,
                          background: "transparent",
                          color: "white",
                          border: "none",
                          fontWeight: 500,
                          fontSize: 13,
                          outline: "none",
                          padding: "4px 0",
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      <label
                        onClick={(e) => e.stopPropagation()}
                        style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 11 }}
                      >
                        <input
                          type="checkbox"
                          checked={wf.status === 'active'}
                          onChange={() => updateWorkflowStatus(wf.workflowId, wf.status === 'active' ? 'inactive' : 'active')}
                          disabled={isUpdatingStatus}
                          style={{ width: 16, height: 16, cursor: "pointer" }}
                        />
                        <span style={{ fontSize: 10, color: "#9ca3af" }}>
                          {wf.status === 'active' ? "Đang hoạt động" : wf.status === 'inactive' ? "Vô hiệu" : "Nháp"}
                        </span>
                      </label>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteWorkflow(wf.workflowId); }}
                        style={{ background: "none", border: "none", color: "#fca5a5", cursor: "pointer", fontSize: 14, padding: "0 4px" }}
                        title="Xóa workflow"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>
                    {wf.nodes?.length || 0} nodes | {wf.edges?.length || 0} connections
                  </div>
                </div>
              ))}
            </div>

            <hr style={{ borderColor: "#4b5563", margin: "16px 0" }} />

            <h4 style={{ marginBottom: 12 }}>🏷️ Thành phần</h4>
            {["START", "APPROVAL", "END"].map((type) => (
              <div
                key={type}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("nodeType", type)}
                style={{
                  padding: "10px 12px",
                  background: type === "START" ? "#10b981" : type === "END" ? "#ef4444" : "#3b82f6",
                  borderRadius: 8,
                  marginBottom: 8,
                  cursor: "grab",
                  textAlign: "center",
                  fontWeight: 500,
                  fontSize: 14,
                  transition: "0.2s",
                }}
              >
                {type === "START" ? "🚀 START" : type === "END" ? "🏁 END" : "✓ APPROVAL"}
              </div>
            ))}

            <hr style={{ borderColor: "#4b5563", margin: "16px 0" }} />

            <h4 style={{ marginBottom: 12 }}>🔗 Loại connection</h4>
            <div style={{ marginBottom: 16 }}>
              <select
                value={edgeType}
                onChange={(e) => setEdgeType(e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 6,
                  marginBottom: 8,
                  background: "#4b5563",
                  color: "white",
                  border: "none",
                }}
              >
                <option value="approval">Kết nối điều kiện - Xanh</option>
                <option value="reject">Kết nối song song - Đỏ</option>
              </select>
            </div>

            <hr style={{ borderColor: "#4b5563", margin: "16px 0" }} />

            {/* DANH SÁCH CHỨC VỤ TỪ BE */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h4 style={{ margin: 0 }}>👥 Chức vụ ({positions.length})</h4>
              <button
                onClick={() => setShowAddPositionModal(true)}
                style={{
                  background: "#10b981",
                  border: "none",
                  borderRadius: 4,
                  padding: "4px 8px",
                  color: "white",
                  cursor: "pointer",
                  fontSize: 11,
                }}
              >
                + Thêm
              </button>
            </div>

            {positionsLoading ? (
              <div style={{ textAlign: "center", padding: 20, color: "#9ca3af" }}>Đang tải...</div>
            ) : positions.length === 0 ? (
              <div style={{ textAlign: "center", padding: 20, color: "#9ca3af" }}>Chưa có chức vụ nào</div>
            ) : (
              positions.map((position) => (
                <div
                  key={position.positionId}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("nodeType", position.positionName)}
                  style={{
                    padding: "8px 12px",
                    background: "#4b5563",
                    borderRadius: 6,
                    marginBottom: 6,
                    cursor: "grab",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 13,
                  }}
                >
                  <span>👤 {position.positionName}</span>
                  <button
                    onClick={() => handleDeletePosition(position.positionId!, position.positionName)}
                    style={{ background: "none", border: "none", color: "#fca5a5", cursor: "pointer", fontSize: 16 }}
                    title="Xóa chức vụ"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* MAIN CANVAS */}
      <div style={{ flex: 1, position: "relative", background: "#f9fafb" }}>
        <div
          id="save-indicator"
          style={{
            position: "absolute",
            top: 10,
            right: 100,
            background: "#10b981",
            color: "white",
            padding: "4px 12px",
            borderRadius: 20,
            fontSize: 12,
            opacity: 0,
            transition: "opacity 0.3s",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          💾 Đã lưu
        </div>

        {isConnecting && (
          <div style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#3b82f6",
            color: "white",
            padding: "8px 16px",
            borderRadius: 20,
            fontSize: 12,
            zIndex: 10,
          }}>
            🔗 Đang tạo connection...
          </div>
        )}

        <ReactFlow
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={() => setIsConnecting(true)}
          onConnectEnd={() => setIsConnecting(false)}
          onNodeClick={(_, node) => {
            setSelectedNode(node);
            setSelectedEdge(null);
            setContextMenu(null);
          }}
          onEdgeClick={onEdgeClick}
          onEdgeDoubleClick={onEdgeDoubleClick}
          onEdgeContextMenu={onEdgeContextMenu}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
          deleteKeyCode={["Delete", "Backspace"]}
          defaultEdgeOptions={{
            type: "custom",
            animated: true,
            style: { stroke: "#3b82f6", strokeWidth: 2 },
          }}
        >
          <Background color="#e5e7eb" gap={20} />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor={(node) => {
              if (node.data.label === "START") return "#10b981";
              if (node.data.label === "END") return "#ef4444";
              if (node.data.label === "APPROVAL") return "#3b82f6";
              return "#9ca3af";
            }}
            maskColor="rgba(0,0,0,0.1)"
          />
          <Panel position="top-left">
            <div style={{ background: "white", padding: "8px 16px", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <strong>📌 {workflowName}</strong>
              <span style={{ marginLeft: 12, fontSize: 12, color: "#6b7280" }}>
                {nodes.length} nodes | {edges.length} connections
              </span>
            </div>
          </Panel>
          <Panel position="bottom-right">
            <button
              onClick={validateWorkflow}
              style={{
                padding: "10px 16px",
                background: "#8b5cf6",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
                marginRight: 8,
              }}
            >
              🔍 Validate
            </button>
            <button
              onClick={saveToServer}
              disabled={isSaving}
              style={{
                padding: "10px 16px",
                background: isSaving ? "#9ca3af" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: isSaving ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              {isSaving ? "💾 Đang lưu..." : "☁️ Lưu server"}
            </button>
          </Panel>
        </ReactFlow>

        {contextMenu && (
          <div
            style={{
              position: "fixed",
              top: contextMenu.y,
              left: contextMenu.x,
              background: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              borderRadius: 8,
              padding: "4px 0",
              zIndex: 1000,
            }}
          >
            <button
              onClick={() => deleteEdge(contextMenu.edgeId!)}
              style={{
                width: "100%",
                padding: "8px 16px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
                color: "#ef4444",
              }}
            >
              🗑️ Xóa connection
            </button>
            <button
              onClick={() => setContextMenu(null)}
              style={{
                width: "100%",
                padding: "8px 16px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              ❌ Hủy
            </button>
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR */}
      <div
        style={{
          width: showProperties ? 300 : 50,
          transition: "0.3s",
          background: "white",
          padding: showProperties ? 16 : 8,
          overflowY: "auto",
          boxShadow: "-2px 0 8px rgba(0,0,0,0.05)",
          borderLeft: "1px solid #e5e7eb",
        }}
      >
        <button
          onClick={() => setShowProperties(!showProperties)}
          style={{
            width: "100%",
            padding: 8,
            background: "#6b7280",
            border: "none",
            borderRadius: 8,
            color: "white",
            cursor: "pointer",
            marginBottom: 12,
          }}
        >
          {showProperties ? "Đóng ▶" : "◀ Mở"}
        </button>

        {showProperties && (
          <>
            <h3 style={{ margin: "0 0 16px 0", fontSize: 18 }}>⚙️ Thuộc tính</h3>
            
            {selectedNode ? (
              <>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontWeight: 600, display: "block", marginBottom: 6, fontSize: 13 }}>
                    🏷️ Nhãn
                  </label>
                  <input
                    value={selectedNode.data.label}
                    onChange={(e) => updateNodeData("label", e.target.value)}
                    style={{
                      width: "90%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 14,
                    }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontWeight: 600, display: "block", marginBottom: 6, fontSize: 13 }}>
                    👤 Chức vụ phụ trách
                  </label>
                  <select
                    value={selectedNode.data.assignedRole || ""}
                    onChange={(e) => updateNodeData("assignedRole", e.target.value)}
                    style={{
                      width: "98%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 14,
                    }}
                  >
                    <option value="">-- Chọn chức vụ --</option>
                    {positions.map((position) => (
                      <option key={position.positionId} value={position.positionName}>{position.positionName}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontWeight: 600, display: "block", marginBottom: 6, fontSize: 13 }}>
                    📝 Mô tả
                  </label>
                  <textarea
                    value={selectedNode?.data?.description || ""}
                    onChange={(e) => updateNodeData("description", e.target.value)}
                    rows={3}
                    style={{
                      width: "90%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 13,
                      resize: "vertical",
                    }}
                    placeholder="Nhập mô tả cho node này..."
                  />
                </div>

                <button
                  onClick={deleteNode}
                  style={{
                    width: "100%",
                    padding: 10,
                    background: "#ef4444",
                    border: "none",
                    borderRadius: 8,
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  🗑️ Xóa node
                </button>
              </>
            ) : selectedEdge ? (
              <>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontWeight: 600, display: "block", marginBottom: 6, fontSize: 13 }}>
                    🔗 Loại connection
                  </label>
                  <select
                    value={selectedEdge.data?.type || "approval"}
                    onChange={(e) => updateEdge(selectedEdge.id, { type: e.target.value })}
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 14,
                    }}
                  >
                    <option value="approval">Kết nối điều kiện - Xanh</option>
                    <option value="reject">Kết nối song song - Đỏ</option>
                  </select>
                </div>

                <button
                  onClick={() => deleteEdge(selectedEdge.id)}
                  style={{
                    width: "100%",
                    padding: 10,
                    background: "#ef4444",
                    border: "none",
                    borderRadius: 8,
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  🗑️ Xóa connection
                </button>
              </>
            ) : (
              <>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontWeight: 600, display: "block", marginBottom: 6, fontSize: 13 }}>
                    📝 Tên quy trình
                  </label>
                  <input
                    type="text"
                    value={workflowName}
                    onChange={async (e) => {
                      const newName = e.target.value;
                      const oldName = workflowName;
                      setWorkflowName(newName);
                      await renameWorkflow(currentWorkflowId, newName, oldName);
                    }}
                    style={{
                      width: "90%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 14,
                    }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontWeight: 600, display: "block", marginBottom: 6, fontSize: 13 }}>
                    📋 Mô tả quy trình
                  </label>
                  <textarea
                    value={workflowDescription}
                    onChange={async (e) => {
                      const newDescription = e.target.value;
                      setWorkflowDescription(newDescription);
                      await updateWorkflowDescription(newDescription);
                    }}
                    rows={4}
                    style={{
                      width: "90%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 13,
                      resize: "vertical",
                    }}
                    placeholder="Nhập mô tả cho quy trình này..."
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* MODAL THÊM CHỨC VỤ */}
      {showAddPositionModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            animation: "fadeIn 0.2s ease",
          }}
        >
          <div
            style={{
              width: 400,
              background: "#fff",
              borderRadius: 20,
              padding: 25,
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ marginBottom: 20, fontSize: 24, fontWeight: 700 }}>
              ➕ Thêm chức vụ mới
            </h2>

            <input
              placeholder="Tên chức vụ *"
              value={newPositionName}
              onChange={(e) => setNewPositionName(e.target.value)}
              style={{
                width: "95%",
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #d1d5db",
                outline: "none",
                fontSize: 14,
              }}
              onKeyPress={(e) => e.key === "Enter" && handleAddPosition()}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 25 }}>
              <button
                onClick={() => {
                  setShowAddPositionModal(false);
                  setNewPositionName("");
                }}
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Hủy
              </button>

              <button
                onClick={handleAddPosition}
                style={{
                  padding: "10px 18px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg,#2563eb,#3b82f6)",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Thêm mới
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}