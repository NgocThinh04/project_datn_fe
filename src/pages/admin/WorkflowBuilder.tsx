import { useState, useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  type Connection,
} from "reactflow";
import "reactflow/dist/style.css";

/* ================= NODE ================= */
const CustomNode = ({ data }: any) => {
  const getColor = (label: string) => {
    if (label === "START") return "#28a745";
    if (label === "END") return "#dc3545";
    if (label === "APPROVAL") return "#007bff";
    return "#6c757d";
  };

  return (
    <div
      style={{
        padding: "10px 15px",
        borderRadius: 12,
        background: "#fff",
        border: `2px solid ${getColor(data.label)}`,
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        minWidth: 100,
        textAlign: "center",
        fontWeight: 600,
      }}
    >
      <Handle type="target" position={Position.Top} />
      {data.label}
      {data.assignedRole && (
        <div style={{ fontSize: "12px", marginTop: 4, color: "#555", fontWeight: 500 }}>
          ({data.assignedRole})
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const nodeTypes = { default: CustomNode };

/* ================= MAIN ================= */
export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const [selectedWorkflowIds, setSelectedWorkflowIds] = useState<string[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const [collapseLeft, setCollapseLeft] = useState(false);
  const [collapseRight, setCollapseRight] = useState(false);

  const [workflows, setWorkflows] = useState<any[]>([]);
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string>("");

  const [roles, setRoles] = useState<string[]>([]);
  const [newRole, setNewRole] = useState("");

  const isLoadingRef = useRef(false);
  const isInitialized = useRef(false);

  /* ================= LOAD ROLES (Tách riêng - Fix hiển thị) ================= */
  useEffect(() => {
    const savedRoles = localStorage.getItem("roles");
    if (savedRoles) {
      try {
        const parsed = JSON.parse(savedRoles);
        setRoles(parsed);
        console.log("✅ Roles loaded from localStorage:", parsed);
      } catch (e) {
        console.error("Error parsing roles", e);
        setDefaultRoles();
      }
    } else {
      setDefaultRoles();
    }
  }, []);

  const setDefaultRoles = () => {
    const defaults = ["MANAGER", "HR", "CEO"];
    setRoles(defaults);
    localStorage.setItem("roles", JSON.stringify(defaults));
    console.log("Set default roles");
  };

  /* ================= LOAD WORKFLOWS ================= */
  useEffect(() => {
    const saved = localStorage.getItem("workflows");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWorkflows(parsed);
        if (parsed.length > 0) {
          setCurrentWorkflowId(parsed[0].id);
        }
      } catch (e) {
        console.error("Parse workflows error", e);
        initDefault();
      }
    } else {
      initDefault();
    }
  }, []);

  const initDefault = () => {
    const init = [{ id: "1", name: "Xin nghỉ phép", nodes: [], edges: [] }];
    setWorkflows(init);
    setCurrentWorkflowId("1");
  };

  /* ================= LOAD NODES & EDGES ================= */
  useEffect(() => {
    if (!currentWorkflowId) return;

    isLoadingRef.current = true;
    const wf = workflows.find((w) => w.id === currentWorkflowId);
    if (wf) {
      setNodes(wf.nodes || []);
      setEdges(wf.edges || []);
    }
    setTimeout(() => (isLoadingRef.current = false), 150);
  }, [currentWorkflowId, workflows]);

  /* ================= SAVE & SYNC ================= */
  useEffect(() => {
    if (workflows.length > 0 && isInitialized.current) {
      localStorage.setItem("workflows", JSON.stringify(workflows));
    }
  }, [workflows]);

  const syncToWorkflow = useCallback(() => {
    if (isLoadingRef.current || !currentWorkflowId) return;
    setWorkflows((prev) =>
      prev.map((wf) =>
        wf.id === currentWorkflowId
          ? { ...wf, nodes: [...nodes], edges: [...edges] }
          : wf
      )
    );
  }, [currentWorkflowId, nodes, edges]);

  useEffect(() => {
    syncToWorkflow();
  }, [syncToWorkflow]);

  useEffect(() => {
    if (workflows.length > 0) isInitialized.current = true;
  }, [workflows]);

  /* ================= ROLE FUNCTIONS ================= */
  const updateNodeRole = (role: string) => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id
          ? { ...n, data: { ...n.data, assignedRole: role } }
          : n
      )
    );
    setSelectedNode((prev: any) =>
      prev ? { ...prev, data: { ...prev.data, assignedRole: role } } : null
    );
  };

  /* ================= DRAG & DROP ================= */
  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("nodeType");
    if (!type) return;

    const bounds = e.currentTarget.getBoundingClientRect();
    const newNode = {
      id: Date.now().toString(),
      position: { x: e.clientX - bounds.left, y: e.clientY - bounds.top },
      data: { label: type, assignedRole: "" },
      type: "default",
    };
    setNodes((nds) => [...nds, newNode]);
  };

  /* ================= ACTIONS================= */
  const deleteWorkflow = (id: string) => {
    if (workflows.length === 1) {
      alert("Phải giữ lại ít nhất 1 workflow!");
      return;
    }
    if (!window.confirm("Bạn có chắc muốn xóa workflow này?")) return;

    setWorkflows((prev) => prev.filter((w) => w.id !== id));

    if (currentWorkflowId === id) {
      const remaining = workflows.filter((w) => w.id !== id);
      if (remaining.length > 0) setCurrentWorkflowId(remaining[0].id);
    }
  };

  const createWorkflow = () => {
    const newWf = {
      id: Date.now().toString(),
      name: `Quy trình mới ${workflows.length + 1}`,
      nodes: [],
      edges: [],
    };
    setWorkflows((prev) => [...prev, newWf]);
    setCurrentWorkflowId(newWf.id);
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    []
  );

  const deleteNode = () => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setSelectedNode(null);
  };

  const saveWorkflow = () => alert("Quy trình đã được lưu!");

  /* ================= UI ================= */
  return (
    <div style={{ display: "flex", height: "91.5vh", overflow: "hidden" }}>
      {/* LEFT PANEL */}
      <div
        style={{
          width: collapseLeft ? 50 : 260,
          transition: "0.3s",
          background: "#1e1e2f",
          color: "#fff",
          padding: 10,
          overflowY: "auto",
        }}
      >
        <button onClick={() => setCollapseLeft(!collapseLeft)}>
          {collapseLeft ? "➡" : "⬅"}
        </button>

        {!collapseLeft && (
          <>
            <h3>Quy trình</h3>
            <button onClick={createWorkflow} style={{ marginBottom: 12 }}>
              + Tạo mới
            </button>

            {workflows.map((wf) => (
              <div
                key={wf.id}
                onMouseEnter={() => setHoveredId(wf.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setCurrentWorkflowId(wf.id)}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  marginTop: 5,
                  cursor: "pointer",
                  background: wf.id === currentWorkflowId ? "#2563eb" : hoveredId === wf.id ? "#3b3b52" : "#2e2e42",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <input
                    type="checkbox"
                    checked={selectedWorkflowIds.includes(wf.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedWorkflowIds((prev) => [...prev, wf.id]);
                      } else {
                        setSelectedWorkflowIds((prev) => prev.filter((id) => id !== wf.id));
                      }
                    }}
                  />
                  <input
                    value={wf.name}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      setWorkflows((prev) =>
                        prev.map((w) => (w.id === wf.id ? { ...w, name: e.target.value } : w))
                      )
                    }
                    style={{
                      flex: 1,
                      background: "transparent",
                      color: "white",
                      border: "none",
                      marginLeft: 8,
                    }}
                  />
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteWorkflow(wf.id); }}
                  style={{ background: "red", color: "white", border: "none", borderRadius: 4, padding: "2px 6px", fontSize: "12px" }}
                >
                  ✕
                </button>
              </div>
            ))}

            <hr />

            {["START", "APPROVAL", "END"].map((type) => (
              <div
                key={type}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("nodeType", type)}
                style={{ padding: 10, background: "#444", borderRadius: 6, marginTop: 5, cursor: "grab", textAlign: "center" }}
              >
                {type}
              </div>
            ))}

            <hr />

            <h4>Vai trò ({roles.length})</h4>
            {roles.length > 0 ? (
              roles.map((role) => (
                <div
                  key={role}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("nodeType", role)}
                  style={{
                    padding: 10,
                    background: "#2e2e42",
                    borderRadius: 6,
                    marginTop: 5,
                    cursor: "grab",
                    textAlign: "center",
                  }}
                >
                  {role}
                </div>
              ))
            ) : (
              <p style={{ color: "#888" }}>Đang tải vai trò...</p>
            )}

            {/* Add Role */}
            <div style={{ marginTop: 10 }}>
              <input
                placeholder="Nhập tên role..."
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                style={{ width: "95%", padding: 6, borderRadius: 4 }}
              />
              <button
                onClick={() => {
                  if (!newRole.trim()) return;
                  const upper = newRole.toUpperCase().trim();
                  if (roles.includes(upper)) return alert("Role đã tồn tại");
                  setRoles((prev) => [...prev, upper]);
                  setNewRole("");
                }}
                style={{ marginTop: 5, width: "100%", padding: 8, background: "#16a34a", color: "#fff", border: "none", borderRadius: 6 }}
              >
                + Add Role
              </button>
            </div>
          </>
        )}
      </div>

    
      <div style={{ flex: 1, position: "relative" }}>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, node) => setSelectedNode(node)}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>

        <button onClick={saveWorkflow} style={{ position: "absolute", bottom: 20, right: 20, padding: "10px 16px", background: "#007bff", color: "#fff", border: "none", borderRadius: 6 }}>
          💾 Save Workflow
        </button>
      </div>

      <div style={{ width: collapseRight ? 50 : 260, transition: "0.3s", background: "#fafafa", padding: 10, overflowY: "auto" }}>
        <button onClick={() => setCollapseRight(!collapseRight)}>
          {collapseRight ? "⬅" : "➡"}
        </button>

        {!collapseRight && (
          <>
            <h3>Thông tin </h3>
            {!selectedNode ? (
              <p>Chọn node để chỉnh sửa</p>
            ) : (
              <>
                <p><strong>Label:</strong></p>
                <input
                  value={selectedNode.data.label}
                  onChange={(e) =>
                    setNodes((nds) =>
                      nds.map((n) =>
                        n.id === selectedNode.id
                          ? { ...n, data: { ...n.data, label: e.target.value } }
                          : n
                      )
                    )
                  }
                  style={{ width: "100%", padding: 8, marginBottom: 10 }}
                />

                <p><strong>Chọn vai trò:</strong></p>
                <select
                  value={selectedNode.data.assignedRole || ""}
                  onChange={(e) => updateNodeRole(e.target.value)}
                  style={{ width: "100%", padding: 8, marginBottom: 15 }}
                >
                  <option value="">-- Chọn vai trò --</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>

                <button onClick={deleteNode} style={{ background: "red", color: "white", padding: "8px 12px", border: "none", borderRadius: 6 }}>
                  Delete Node
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}