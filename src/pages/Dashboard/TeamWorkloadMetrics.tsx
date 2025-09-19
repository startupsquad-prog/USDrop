import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Employee {
  name: string;
  photo: string;
  total: number;
  fresh: number;
  follow: number;
  notConn: number;
}

export default function TeamWorkloadMetrics() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
  const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID2;

  const tables = {
    leads: "Leads",
    employees: "Employee Directory",
    departments: "Departments",
  };

  const fields = {
    assigned: "Assigned To",
    name: "Full Name",
    photo: "Profile Photo",
    deptLink: "Department",
    deptName: "Department Name",
    stage: "Stage",
  };

  const stages = {
    fresh: "Fresh",
    follow: "Follow Up Required",
    notConn: "Not Connected",
  };

  const targetDept = "Sales & Customer Success";

  const fetchAirtable = async (
    table: string,
    fieldsArr: string[],
    filter = ""
  ) => {
    let url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
      table
    )}?${fieldsArr.map((f) => `fields[]=${encodeURIComponent(f)}`).join("&")}`;
    if (filter) url += `&filterByFormula=${filter}`;

    let records: any[] = [];
    let offset: string | undefined;

    do {
      const res = await fetch(url + (offset ? `&offset=${offset}` : ""), {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status} on ${table}`);
      const data = await res.json();
      records = records.concat(data.records);
      offset = data.offset;
    } while (offset);

    return records;
  };

  const runMetrics = async () => {
    setLoading(true);
    setError(null);

    try {
      const deptFilter = encodeURIComponent(
        `({${fields.deptName}} = '${targetDept}')`
      );

      const dept = await fetchAirtable(
        tables.departments,
        [fields.deptName],
        deptFilter
      );

      if (!dept.length)
        throw new Error(`No department '${targetDept}' found`);

      const deptId = dept[0].id;

      const employeesRaw = await fetchAirtable(tables.employees, [
        fields.name,
        fields.photo,
        fields.deptLink,
      ]);

      const salesEmployees = employeesRaw.filter((e) =>
        e.fields[fields.deptLink]?.includes(deptId)
      );

      const leads = await fetchAirtable(tables.leads, [
        fields.assigned,
        fields.stage,
      ]);

      const counts = new Map<string, Employee>();

      salesEmployees.forEach((e: any) =>
        counts.set(e.id, {
          name: e.fields[fields.name] || "Unknown",
          photo: e.fields[fields.photo]?.[0]?.thumbnails?.small?.url || "",
          total: 0,
          fresh: 0,
          follow: 0,
          notConn: 0,
        })
      );

      leads.forEach((l: any) => {
        const [empId] = l.fields[fields.assigned] || [];
        if (counts.has(empId)) {
          const emp = counts.get(empId)!;
          emp.total++;
          if (l.fields[fields.stage] === stages.fresh) emp.fresh++;
          else if (l.fields[fields.stage] === stages.follow) emp.follow++;
          else if (l.fields[fields.stage] === stages.notConn) emp.notConn++;
        }
      });

      setEmployees([...counts.values()].sort((a, b) => b.total - a.total));
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    runMetrics();
  }, []);

  const percentage = (count: number, total: number) =>
    total ? (count / total) * 100 : 0;

  return (
    <div className="p-8 bg-white rounded-2xl shadow-md max-w-6xl mx-auto font-sans">
      <div className="flex justify-between items-center border-b border-gray-200 pb-5 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Team Workload Overview
        </h2>
        <div className="flex gap-3">
          <button
            onClick={runMetrics}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100 transition"
          >
            Refresh
          </button>
          <a
            href="/old-home-b5231aef-cdf4-4116-a8cd-43c274a8c910"
            className="relative group flex items-center justify-center px-4 py-2 text-sm rounded-full bg-[#0052D4] text-white font-semibold shadow-md overflow-hidden transition-all duration-300"
          >
            <span className="relative z-10">Start Assigning</span>
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#0052D4] to-[#4364F7] z-0" />
          </a>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-600 font-medium">Error: {error}</p>
          <p className="text-red-500 text-sm mt-1">
            Please check your Airtable configuration or contact support.
          </p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-[#0052D4]" />
            <p className="mt-3 text-gray-600">Loading team data...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No team data available</p>
          </div>
        ) : (
          employees.map((emp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.03 }}
              className="p-6 border border-gray-200 rounded-2xl shadow-sm bg-white transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="flex items-center gap-4 mb-5">
                {emp.photo ? (
                  <img
                    src={emp.photo}
                    alt={emp.name}
                    className="w-14 h-14 rounded-full object-cover shadow-sm"
                  />
                ) : (
                  <div className="w-14 h-14 flex items-center justify-center bg-gray-200 rounded-full font-semibold text-xl text-gray-600">
                    {emp.name[0]}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {emp.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{emp.total} Total Leads</p>
                </div>
              </div>

              {(["fresh", "follow", "notConn"] as const).map((type) => (
                <div key={type} className="mb-4">
                  <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
                    <span>{stages[type]}</span>
                    <span>{emp[type]}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`h-2 rounded-full ${
                        type === "fresh"
                          ? "bg-blue-600"
                          : type === "follow"
                          ? "bg-yellow-400"
                          : "bg-gray-400"
                      }`}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${percentage(emp[type], emp.total)}%`,
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
