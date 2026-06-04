"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import type { Visitor } from "@/types";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { Download, Globe, Monitor, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#00A651", "#FEDD00", "#003F87", "#64748b", "#475569"];

export default function AnalyticsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitors = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("visitors")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setVisitors(data);
      setLoading(false);
    };
    fetchVisitors();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  // Country breakdown
  const countryData = Object.entries(
    visitors.reduce<Record<string, number>>((acc, v) => {
      const country = v.country || "Unknown";
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Device breakdown
  const deviceData = Object.entries(
    visitors.reduce<Record<string, number>>((acc, v) => {
      const device = v.device || "Unknown";
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Page views
  const pageData = Object.entries(
    visitors.reduce<Record<string, number>>((acc, v) => {
      acc[v.page_visited] = (acc[v.page_visited] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Daily visits (last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  const dailyData = last30Days.map((date) => ({
    date: date.slice(5),
    visits: visitors.filter((v) => v.created_at?.startsWith(date)).length,
  }));

  const handleExportCSV = () => {
    const headers = ["IP", "Country", "Device", "Browser", "OS", "Page", "Date"];
    const rows = visitors.map((v) =>
      [v.ip_address, v.country, v.device, v.browser, v.os, v.page_visited, v.created_at]
        .map((val) => `"${val || ""}"`)
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "visitors.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Analytics</h1>
          <p className="text-dark-400 text-sm">{visitors.length} total visitors</p>
        </div>
        <Button variant="outline" onClick={handleExportCSV} className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Visits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Visits (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="visits"
                  stroke="#003F87"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#003F87" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {deviceData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
              {deviceData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-dark-400">{d.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={countryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={100} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                />
                <Bar dataKey="value" fill="#00A651" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Page Views */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Most Visited Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={120} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                />
                <Bar dataKey="value" fill="#FEDD00" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Visitors Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Visitors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-glass-border">
                  <th className="text-left text-dark-400 font-medium py-3 px-2">Country</th>
                  <th className="text-left text-dark-400 font-medium py-3 px-2">Device</th>
                  <th className="text-left text-dark-400 font-medium py-3 px-2">Browser</th>
                  <th className="text-left text-dark-400 font-medium py-3 px-2">Page</th>
                  <th className="text-left text-dark-400 font-medium py-3 px-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {visitors.slice(0, 20).map((v) => (
                  <tr key={v.id} className="border-b border-glass-border/50 hover:bg-glass-hover transition-colors">
                    <td className="py-3 px-2 text-white">{v.country || "—"}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        {v.device === "mobile" ? (
                          <Smartphone className="h-3.5 w-3.5 text-dark-400" />
                        ) : (
                          <Monitor className="h-3.5 w-3.5 text-dark-400" />
                        )}
                        <span className="text-dark-300">{v.device || "—"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-dark-300">{v.browser || "—"}</td>
                    <td className="py-3 px-2 text-dark-300">{v.page_visited}</td>
                    <td className="py-3 px-2 text-dark-400 text-xs">{v.created_at ? formatDate(v.created_at) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
