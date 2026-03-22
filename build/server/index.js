import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, createCookieSessionStorage, redirect, json } from "@remix-run/node";
import { RemixServer, Meta, Links, Outlet, ScrollRestoration, Scripts, Link, useLoaderData, useNavigate, useRevalidator, useFetcher, useActionData, useNavigation, Form, NavLink } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { ArrowLeft, Search, Users, ArrowUpRight, Briefcase, Building2, ExternalLink, IndianRupee, Calendar, MapPin, Layers3, BadgeCheck, ClipboardList, GraduationCap, Tag, User, Mail, Phone, CheckCircle2, XCircle, ChevronDown, X, Video, ArrowRight, FileText, TrendingUp, CalendarClock, ShieldCheck, Plus, Lock, Menu, LogOut, LayoutDashboard, Settings } from "lucide-react";
import clsx from "clsx";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
const ABORT_DELAY = 5e3;
function handleRequest(request2, responseStatusCode, responseHeaders, remixContext, loadContext) {
  let prohibitOutOfOrderStreaming = isBotRequest(request2.headers.get("user-agent")) || remixContext.isSpaMode;
  return prohibitOutOfOrderStreaming ? handleBotRequest(
    request2,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request2,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function isBotRequest(userAgent) {
  if (!userAgent) {
    return false;
  }
  if ("isbot" in isbotModule && typeof isbotModule.isbot === "function") {
    return isbotModule.isbot(userAgent);
  }
  if ("default" in isbotModule && typeof isbotModule.default === "function") {
    return isbotModule.default(userAgent);
  }
  return false;
}
function handleBotRequest(request2, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request2.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request2, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request2.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const stylesheet = "/assets/tailwind-yWHqpj2i.css";
const links$1 = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" }
];
const meta$a = () => [
  { title: "CareerNest - Company Portal" },
  { name: "description", content: "Company hiring and drive management portal" }
];
function App() {
  return /* @__PURE__ */ jsxs("html", { lang: "en", className: "h-full", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "h-full", children: [
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function ErrorBoundary() {
  return /* @__PURE__ */ jsxs("html", { lang: "en", className: "h-full", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "h-full flex items-center justify-center bg-surface-50", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-6xl font-bold text-primary-600 mb-4", children: "Oops!" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-surface-600 mb-6", children: "Something went wrong" }),
        /* @__PURE__ */ jsx(Link, { to: "/", className: "px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors", children: "Go Home" })
      ] }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: App,
  links: links$1,
  meta: meta$a
}, Symbol.toStringTag, { value: "Module" }));
function cn(...inputs) {
  return clsx(inputs);
}
function Card({ className, hover, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "rounded-2xl bg-white p-6 shadow-sm",
        hover && "transition-shadow hover:shadow-md",
        className
      ),
      ...props
    }
  );
}
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variant || "bg-slate-100 text-slate-700",
        className
      ),
      ...props
    }
  );
}
function EmptyState({ icon, title, description, action: action2 }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center px-6 py-10 text-center", children: [
    icon ? /* @__PURE__ */ jsx("div", { className: "mb-3 text-slate-400", children: icon }) : null,
    /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-slate-900", children: title }),
    description ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-500", children: description }) : null,
    action2 ? /* @__PURE__ */ jsx("div", { className: "mt-4", children: action2 }) : null
  ] });
}
function StatCard({ title, value, subtitle, icon, className }) {
  return /* @__PURE__ */ jsx(Card, { className: cn("!p-4", className), children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-slate-500", children: title }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-2xl font-semibold text-slate-900", children: value }),
      subtitle ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-500", children: subtitle }) : null
    ] }),
    icon ? /* @__PURE__ */ jsx("div", { className: "text-slate-500", children: icon }) : null
  ] }) });
}
function Button({
  className,
  isLoading,
  variant = "solid",
  size = "md",
  children,
  disabled,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      className: cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-11 px-5 text-base",
        variant === "solid" && "bg-primary-600 text-white hover:bg-primary-700",
        variant === "ghost" && "bg-transparent text-slate-700 hover:bg-slate-100",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className
      ),
      disabled: disabled || isLoading,
      ...props,
      children
    }
  );
}
function Input({ label, icon, className, id, ...props }) {
  const inputId = id || props.name;
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    label ? /* @__PURE__ */ jsx("span", { className: "mb-1.5 block text-sm font-medium text-slate-700", children: label }) : null,
    /* @__PURE__ */ jsxs("span", { className: "relative block", children: [
      icon ? /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400", children: icon }) : null,
      /* @__PURE__ */ jsx(
        "input",
        {
          id: inputId,
          className: cn(
            "w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-3 text-sm outline-none transition-colors focus:border-primary-500",
            icon ? "pl-10" : "pl-3",
            className
          ),
          ...props
        }
      )
    ] })
  ] });
}
function Textarea({ label, className, id, ...props }) {
  const inputId = id || props.name;
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    label ? /* @__PURE__ */ jsx("span", { className: "mb-1.5 block text-sm font-medium text-slate-700", children: label }) : null,
    /* @__PURE__ */ jsx(
      "textarea",
      {
        id: inputId,
        className: cn(
          "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary-500",
          className
        ),
        ...props
      }
    )
  ] });
}
function Modal({ isOpen, onClose, title, size = "md", children }) {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40", onClick: onClose }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: cn(
          "relative z-10 w-full rounded-2xl bg-white p-5 shadow-xl",
          size === "sm" && "max-w-md",
          size === "md" && "max-w-lg",
          size === "lg" && "max-w-3xl",
          size === "xl" && "max-w-5xl"
        ),
        children: [
          title ? /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold text-slate-900", children: title }) : null,
          children
        ]
      }
    )
  ] });
}
function formatDate$2(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function getCookieName(appName) {
  return `cn_${appName}_session`;
}
function createAuthHelpers(appName, options = {}) {
  const sessionSecret = process.env.SESSION_SECRET || "dev-session-secret";
  const storage = createCookieSessionStorage({
    cookie: {
      name: getCookieName(appName),
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      secrets: [sessionSecret],
      maxAge: options.maxAge ?? 60 * 60 * 24
    }
  });
  async function getSession(request2) {
    const cookie = request2.headers.get("Cookie");
    return storage.getSession(cookie);
  }
  async function commitSession(session) {
    return storage.commitSession(session);
  }
  async function destroySession(session) {
    return storage.destroySession(session);
  }
  function parseUser(rawUser) {
    var _a;
    if (!rawUser || typeof rawUser !== "object") return null;
    const user = rawUser;
    if (!user.role) return null;
    if (((_a = options.allowedRoles) == null ? void 0 : _a.length) && !options.allowedRoles.includes(user.role)) {
      return null;
    }
    return user;
  }
  async function getUserSession2(request2) {
    const session = await getSession(request2);
    const token = String(session.get("token") || "");
    const user = parseUser(session.get("user"));
    return { session, token, user };
  }
  async function requireUserSession2(request2) {
    const { token, user } = await getUserSession2(request2);
    if (!token || !user) {
      throw redirect("/login");
    }
    return { token, user };
  }
  async function createUserSession2(request2, token, user, redirectTo = "/") {
    const session = await getSession(request2);
    session.set("token", token);
    session.set("user", user);
    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await commitSession(session)
      }
    });
  }
  async function logout2(request2) {
    const session = await getSession(request2);
    return redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session)
      }
    });
  }
  return {
    getSession,
    commitSession,
    destroySession,
    createUserSession: createUserSession2,
    getUserSession: getUserSession2,
    requireUserSession: requireUserSession2,
    logout: logout2
  };
}
const { createUserSession, getUserSession, requireUserSession, logout } = createAuthHelpers("company", {
  allowedRoles: ["company"],
  maxAge: 60 * 60 * 24
  // 24 hours — matches JWT expiry
});
const API_ROOT = (process.env.API_URL || "http://localhost:4000").replace(/\/$/, "");
function withQuery(path, query) {
  if (!query) return path;
  return `${path}${query.startsWith("?") ? query : `?${query}`}`;
}
async function request(method, path, token, body) {
  var _a;
  const response = await fetch(`${API_ROOT}/api/v1${path}`, {
    method,
    headers: {
      ...token ? { Authorization: `Bearer ${token}` } : {},
      ...body ? { "Content-Type": "application/json" } : {}
    },
    ...body ? { body: JSON.stringify(body) } : {}
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = ((_a = payload == null ? void 0 : payload.error) == null ? void 0 : _a.message) || (payload == null ? void 0 : payload.message) || `Request failed: ${response.status}`;
    throw new Error(message);
  }
  return (payload == null ? void 0 : payload.data) ? payload : { data: payload };
}
function resource(basePath) {
  return {
    list(token, query) {
      return request("GET", withQuery(basePath, query), token);
    },
    getById(token, id) {
      return request("GET", `${basePath}/${id}`, token);
    },
    create(token, data) {
      return request("POST", basePath, token, data);
    },
    update(token, id, data) {
      return request("PATCH", `${basePath}/${id}`, token, data);
    }
  };
}
const api = {
  companies: resource("/companies"),
  drives: resource("/drives"),
  applications: {
    ...resource("/applications"),
    updateStage(token, id, stage) {
      return request("PATCH", `/applications/${id}/stage`, token, { stage });
    }
  },
  interviews: {
    ...resource("/interviews"),
    getRoomDetails(token, roomId) {
      return request("GET", `/interviews/room/${roomId}`, token);
    },
    join(token, interviewId) {
      return request("POST", `/interviews/${interviewId}/join`, token);
    },
    extend(token, interviewId, minutes) {
      return request("POST", `/interviews/${interviewId}/extend`, token, { minutes });
    }
  },
  students: {
    getDirectoryProfile(token, studentId) {
      return request("GET", `/students/${studentId}/directory-profile`, token);
    }
  },
  tenants: resource("/tenants")
};
function withBasePath(path) {
  const basePath = (process.env.APP_BASE_PATH || "/").replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return basePath && basePath !== "/" ? `${basePath}${normalizedPath}` : normalizedPath;
}
const meta$9 = () => [{ title: "Applicants – CareerNest" }];
const STAGE_COLOR$1 = {
  applied: "bg-blue-50 text-blue-700",
  under_review: "bg-yellow-50 text-yellow-700",
  shortlisted: "bg-purple-50 text-purple-700",
  interview_scheduled: "bg-indigo-50 text-indigo-700",
  selected: "bg-emerald-50 text-emerald-700",
  rejected: "bg-rose-50 text-rose-700"
};
function stageLabel$1(s) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
async function loader$f({ request: request2, params }) {
  const { token, user } = await requireUserSession(request2);
  if (user.role !== "company") throw redirect(withBasePath("/login"));
  const driveId = params.id;
  let drive = null;
  let applications = [];
  try {
    const res = await api.drives.getById(token, driveId);
    drive = res.data || res;
  } catch {
    throw redirect(withBasePath("/drives"));
  }
  try {
    const res = await api.applications.list(token, `driveId=${driveId}&limit=500`);
    applications = res.data || [];
  } catch {
  }
  return json({ drive, applications });
}
function DriveApplicants() {
  const { drive, applications } = useLoaderData();
  const [search, setSearch] = useState("");
  const filtered = applications.filter(
    (a) => !search || (a.studentName || "").toLowerCase().includes(search.toLowerCase()) || (a.studentEmail || "").toLowerCase().includes(search.toLowerCase())
  );
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 animate-fade-in", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/drives", className: "inline-flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-surface-700 transition-colors", children: [
      /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
      " Back to Drives"
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold text-surface-900", children: (drive == null ? void 0 : drive.title) || "Drive" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-surface-500", children: [
        applications.length,
        " applicant",
        applications.length !== 1 ? "s" : ""
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Card, { className: "border border-surface-200 !p-3", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(Search, { size: 15, className: "absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Search by name or email...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "w-full pl-9 pr-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400"
        }
      )
    ] }) }),
    filtered.length === 0 ? /* @__PURE__ */ jsx(Card, { className: "border border-surface-200", children: /* @__PURE__ */ jsx(EmptyState, { icon: /* @__PURE__ */ jsx(Users, { size: 24 }), title: "No applicants yet", description: "Applications will appear here once students apply." }) }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: filtered.map((app) => /* @__PURE__ */ jsx(Link, { to: `/applicants/${app.$id || app.id}`, children: /* @__PURE__ */ jsxs(Card, { hover: true, className: "border border-surface-200 !p-4 flex items-center justify-between gap-4 hover:border-surface-300 transition-colors", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium text-surface-900 truncate", children: app.studentName || app.studentId || "Student" }),
        app.studentEmail && /* @__PURE__ */ jsx("p", { className: "text-sm text-surface-500 truncate", children: app.studentEmail })
      ] }),
      /* @__PURE__ */ jsx("span", { className: `text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${STAGE_COLOR$1[app.stage] || "bg-surface-100 text-surface-600"}`, children: stageLabel$1(app.stage || "applied") })
    ] }) }, app.$id || app.id)) })
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DriveApplicants,
  loader: loader$f,
  meta: meta$9
}, Symbol.toStringTag, { value: "Module" }));
const meta$8 = ({ data }) => {
  var _a;
  return [
    { title: `${((_a = data == null ? void 0 : data.drive) == null ? void 0 : _a.title) || "Drive"} – CareerNest` }
  ];
};
async function loader$e({ request: request2, params }) {
  const { token, user } = await requireUserSession(request2);
  if (user.role !== "company") throw redirect(withBasePath("/login"));
  const id = params.id;
  let drive = null;
  try {
    const res = await api.drives.getById(token, id);
    drive = res.data || res;
  } catch {
    throw redirect(withBasePath("/drives"));
  }
  return json({ drive });
}
function formatDate$1(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
function formatSalary(salary, period) {
  const value = Number(salary || 0);
  if (!value) return "—";
  if (period === "monthly") return `Rs. ${value.toLocaleString("en-IN")}/month`;
  if (value >= 1e5) return `Rs. ${(value / 1e5).toFixed(1)} LPA`;
  return `Rs. ${value.toLocaleString("en-IN")}`;
}
function formatLabel(value) {
  if (!value) return "—";
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function InfoRow({ label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4 py-2.5 border-b border-surface-100 last:border-0", children: [
    /* @__PURE__ */ jsx("span", { className: "text-sm text-surface-500 shrink-0", children: label }),
    /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-surface-900 text-right", children: value || "—" })
  ] });
}
function ViewDrive() {
  var _a, _b, _c;
  const { drive } = useLoaderData();
  if (!drive) return null;
  const departments = Array.isArray(drive.department) && drive.department.length > 0 ? drive.department : [];
  const driveId = drive.$id || drive.id || "";
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl space-y-5 animate-fade-in pb-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/drives", className: "inline-flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-surface-700 transition-colors", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
        " Back to Drives"
      ] }),
      driveId && /* @__PURE__ */ jsxs(
        Link,
        {
          to: `/applicants?driveId=${driveId}`,
          className: "inline-flex items-center gap-2 rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700",
          children: [
            /* @__PURE__ */ jsx(Users, { size: 15 }),
            " View Applicants ",
            /* @__PURE__ */ jsx(ArrowUpRight, { size: 13 })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border border-surface-200 !p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "h-3 bg-gradient-to-r from-primary-500 to-indigo-500" }),
      /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-primary-50 text-primary-600 border border-primary-100", children: /* @__PURE__ */ jsx(Briefcase, { size: 24 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-surface-900", children: drive.title || "—" }),
              (drive.companyName || drive.companies) && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-surface-500 inline-flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(Building2, { size: 13 }),
                drive.companyName || ((_a = drive.companies) == null ? void 0 : _a.name) || ((_c = (_b = drive.companies) == null ? void 0 : _b[0]) == null ? void 0 : _c.name) || ""
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
                /* @__PURE__ */ jsx(Badge, { variant: drive.status === "open" ? "bg-emerald-50 text-emerald-700" : "bg-surface-100 text-surface-600", children: formatLabel(drive.status) }),
                drive.jobType && /* @__PURE__ */ jsx(Badge, { variant: "bg-indigo-50 text-indigo-700", children: formatLabel(drive.jobType) }),
                drive.jobLevel && /* @__PURE__ */ jsx(Badge, { variant: "bg-amber-50 text-amber-700", children: formatLabel(drive.jobLevel) })
              ] })
            ] })
          ] }),
          drive.externalLink && /* @__PURE__ */ jsxs(
            "a",
            {
              href: drive.externalLink,
              target: "_blank",
              rel: "noreferrer",
              className: "shrink-0 inline-flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-100 transition-colors",
              children: [
                "External Listing ",
                /* @__PURE__ */ jsx(ExternalLink, { size: 15 })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 grid gap-3 grid-cols-2 lg:grid-cols-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-surface-200 bg-surface-50 p-4", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-[11px] uppercase tracking-[0.14em] text-surface-400 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(IndianRupee, { size: 11 }),
              " Compensation"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-base font-semibold text-surface-900", children: formatSalary(drive.salary, drive.ctcPeriod) }),
            drive.ctcPeriod && /* @__PURE__ */ jsx("p", { className: "text-xs text-surface-400 mt-0.5", children: formatLabel(drive.ctcPeriod) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-surface-200 bg-surface-50 p-4", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-[11px] uppercase tracking-[0.14em] text-surface-400 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Calendar, { size: 11 }),
              " Deadline"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-base font-semibold text-surface-900", children: formatDate$1(drive.deadline || drive.applicationDeadline) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-surface-200 bg-surface-50 p-4", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-[11px] uppercase tracking-[0.14em] text-surface-400 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Users, { size: 11 }),
              " Vacancies"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-base font-semibold text-surface-900", children: drive.vacancies ?? drive.openings ?? 0 })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-surface-200 bg-surface-50 p-4", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-[11px] uppercase tracking-[0.14em] text-surface-400 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(MapPin, { size: 11 }),
              " Location"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-base font-semibold text-surface-900 truncate", children: drive.location || "—" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-5 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { className: "border border-surface-200 !p-5", children: [
        /* @__PURE__ */ jsxs("h2", { className: "mb-3 flex items-center gap-2 text-sm font-semibold text-surface-800", children: [
          /* @__PURE__ */ jsx(Layers3, { size: 15, className: "text-surface-500" }),
          " Role Details"
        ] }),
        /* @__PURE__ */ jsx(InfoRow, { label: "Experience", value: formatLabel(drive.experience) }),
        /* @__PURE__ */ jsx(InfoRow, { label: "Job Type", value: formatLabel(drive.jobType) }),
        /* @__PURE__ */ jsx(InfoRow, { label: "Job Level", value: formatLabel(drive.jobLevel) }),
        /* @__PURE__ */ jsx(InfoRow, { label: "CTC Period", value: formatLabel(drive.ctcPeriod) }),
        drive.location && /* @__PURE__ */ jsx(InfoRow, { label: "Location", value: drive.location })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "border border-surface-200 !p-5", children: [
        /* @__PURE__ */ jsxs("h2", { className: "mb-3 flex items-center gap-2 text-sm font-semibold text-surface-800", children: [
          /* @__PURE__ */ jsx(BadgeCheck, { size: 15, className: "text-surface-500" }),
          " Eligibility Criteria"
        ] }),
        /* @__PURE__ */ jsx(InfoRow, { label: "Minimum CGPA", value: drive.CGPA ?? "—" }),
        /* @__PURE__ */ jsx(InfoRow, { label: "Allowed Backlogs", value: drive.Backlogs ?? "—" }),
        /* @__PURE__ */ jsx(InfoRow, { label: "Studying Year", value: drive.studyingYear || "—" }),
        /* @__PURE__ */ jsx(
          InfoRow,
          {
            label: "Departments",
            value: departments.length > 0 ? /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-end gap-1", children: departments.map((d) => /* @__PURE__ */ jsx("span", { className: "rounded bg-surface-100 px-1.5 py-0.5 text-xs text-surface-600", children: d }, d)) }) : "—"
          }
        )
      ] })
    ] }),
    drive.description && /* @__PURE__ */ jsxs(Card, { className: "border border-surface-200 !p-5", children: [
      /* @__PURE__ */ jsxs("h2", { className: "flex items-center gap-2 text-sm font-semibold text-surface-800 mb-3", children: [
        /* @__PURE__ */ jsx(ClipboardList, { size: 15, className: "text-surface-500" }),
        " Job Description"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-surface-600 leading-7 whitespace-pre-wrap", children: drive.description })
    ] }),
    drive.eligibility && /* @__PURE__ */ jsxs(Card, { className: "border border-surface-200 !p-5", children: [
      /* @__PURE__ */ jsxs("h2", { className: "flex items-center gap-2 text-sm font-semibold text-surface-800 mb-3", children: [
        /* @__PURE__ */ jsx(GraduationCap, { size: 15, className: "text-surface-500" }),
        " Eligibility Details"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-surface-600 leading-7 whitespace-pre-wrap", children: drive.eligibility })
    ] }),
    drive.requirements && /* @__PURE__ */ jsxs(Card, { className: "border border-surface-200 !p-5", children: [
      /* @__PURE__ */ jsxs("h2", { className: "flex items-center gap-2 text-sm font-semibold text-surface-800 mb-3", children: [
        /* @__PURE__ */ jsx(Tag, { size: 15, className: "text-surface-500" }),
        " Requirements"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-surface-600 leading-7 whitespace-pre-wrap", children: drive.requirements })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border border-surface-200 !p-5 bg-surface-50", children: [
      /* @__PURE__ */ jsxs("h2", { className: "flex items-center gap-2 text-sm font-semibold text-surface-800 mb-3", children: [
        /* @__PURE__ */ jsx(GraduationCap, { size: 15, className: "text-surface-500" }),
        " Hiring Summary"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-sm text-surface-700", children: [
          /* @__PURE__ */ jsx(Users, { size: 13, className: "text-surface-400" }),
          " ",
          drive.vacancies ?? drive.openings ?? 0,
          " vacancies"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-sm text-surface-700", children: [
          /* @__PURE__ */ jsx(MapPin, { size: 13, className: "text-surface-400" }),
          " ",
          drive.location || "—"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-sm text-surface-700", children: [
          /* @__PURE__ */ jsx(Calendar, { size: 13, className: "text-surface-400" }),
          " Deadline: ",
          formatDate$1(drive.deadline || drive.applicationDeadline)
        ] }),
        /* @__PURE__ */ jsx("span", { className: `inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium ${drive.status === "open" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-surface-200 bg-white text-surface-600"}`, children: formatLabel(drive.status) })
      ] })
    ] })
  ] });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ViewDrive,
  loader: loader$e,
  meta: meta$8
}, Symbol.toStringTag, { value: "Module" }));
const meta$7 = () => [{ title: "Applicant – CareerNest" }];
const STAGE_COLOR = {
  applied: "bg-blue-50 text-blue-700",
  under_review: "bg-yellow-50 text-yellow-700",
  shortlisted: "bg-purple-50 text-purple-700",
  interview_scheduled: "bg-indigo-50 text-indigo-700",
  selected: "bg-emerald-50 text-emerald-700",
  rejected: "bg-rose-50 text-rose-700"
};
function stageLabel(s) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
async function loader$d({ request: request2, params }) {
  var _a;
  const { token, user } = await requireUserSession(request2);
  if (user.role !== "company") throw redirect(withBasePath("/login"));
  const id = params.id;
  let application = null;
  let student = null;
  try {
    const res = await api.applications.getById(token, id);
    application = res.data || res;
  } catch {
    throw redirect(withBasePath("/drives"));
  }
  if (application == null ? void 0 : application.studentId) {
    try {
      const res = await api.students.getDirectoryProfile(token, application.studentId);
      student = ((_a = res.data || res) == null ? void 0 : _a.summary) || res.data || res;
    } catch {
    }
  }
  return json({ application, student });
}
function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
function ApplicantDetail() {
  var _a;
  const { application, student } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl space-y-4 animate-fade-in pb-12", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/drives", className: "inline-flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-surface-700 transition-colors", children: [
      /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
      " Back to Drives"
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border border-surface-200 !p-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-surface-100 text-surface-600", children: /* @__PURE__ */ jsx(User, { size: 20 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold text-surface-900", children: (student == null ? void 0 : student.name) || "Applicant" }),
          /* @__PURE__ */ jsx("span", { className: `text-xs font-medium px-2 py-0.5 rounded-full ${STAGE_COLOR[application == null ? void 0 : application.stage] || "bg-surface-100 text-surface-600"}`, children: stageLabel((application == null ? void 0 : application.stage) || "") })
        ] })
      ] }),
      /* @__PURE__ */ jsx("hr", { className: "border-surface-100" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-surface-600", children: [
        (student == null ? void 0 : student.email) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Mail, { size: 13, className: "text-surface-400" }),
          student.email
        ] }),
        (student == null ? void 0 : student.phone) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Phone, { size: 13, className: "text-surface-400" }),
          student.phone
        ] }),
        (application == null ? void 0 : application.$createdAt) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Calendar, { size: 13, className: "text-surface-400" }),
          "Applied: ",
          formatDate(application.$createdAt)
        ] }),
        (application == null ? void 0 : application.driveTitle) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Briefcase, { size: 13, className: "text-surface-400" }),
          application.driveTitle
        ] })
      ] }),
      (student == null ? void 0 : student.headline) && /* @__PURE__ */ jsxs("p", { className: "text-sm text-surface-600 italic", children: [
        '"',
        student.headline,
        '"'
      ] }),
      ((_a = student == null ? void 0 : student.skills) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-surface-500 uppercase mb-2", children: "Skills" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: student.skills.slice(0, 10).map((s) => /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-surface-100 text-surface-600 rounded text-xs", children: s }, s)) })
      ] })
    ] })
  ] });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ApplicantDetail,
  loader: loader$d,
  meta: meta$7
}, Symbol.toStringTag, { value: "Module" }));
const meta$6 = () => [{ title: "Interview Room – CareerNest" }];
const FIVE_MINUTES_MS = 5 * 60 * 1e3;
const DEFAULT_CODE = {
  python: 'def solve():\n    pass\n\nif __name__ == "__main__":\n    solve()\n'
};
const toMonacoLanguage = (language) => {
  return { cpp: "cpp", c: "c", csharp: "csharp", dart: "dart" }[language] || language;
};
async function loader$c({ request: request2, params }) {
  const { token, user } = await requireUserSession(request2);
  const roomId = params.roomId;
  let roomInfo = null;
  try {
    const res = await api.interviews.getRoomDetails(token, roomId);
    roomInfo = res.data || res;
  } catch (err) {
    roomInfo = { roomId, error: (err == null ? void 0 : err.message) || "Room not found" };
  }
  return json({ token, user, roomId, roomInfo });
}
const MicIcon = ({ off }) => /* @__PURE__ */ jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: off ? /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("line", { x1: "1", y1: "1", x2: "23", y2: "23" }),
  /* @__PURE__ */ jsx("path", { d: "M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" }),
  /* @__PURE__ */ jsx("path", { d: "M17 16.95A7 7 0 0 1 5 12v-2m14 0v2" }),
  /* @__PURE__ */ jsx("line", { x1: "12", y1: "19", x2: "12", y2: "23" }),
  /* @__PURE__ */ jsx("line", { x1: "8", y1: "23", x2: "16", y2: "23" })
] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("path", { d: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" }),
  /* @__PURE__ */ jsx("path", { d: "M19 10v2a7 7 0 0 1-14 0v-2" }),
  /* @__PURE__ */ jsx("line", { x1: "12", y1: "19", x2: "12", y2: "23" }),
  /* @__PURE__ */ jsx("line", { x1: "8", y1: "23", x2: "16", y2: "23" })
] }) });
const CamIcon = ({ off }) => /* @__PURE__ */ jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: off ? /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("path", { d: "M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" }),
  /* @__PURE__ */ jsx("line", { x1: "1", y1: "1", x2: "23", y2: "23" })
] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("polygon", { points: "23 7 16 12 23 17 23 7" }),
  /* @__PURE__ */ jsx("rect", { x: "1", y: "5", width: "15", height: "14", rx: "2", ry: "2" })
] }) });
const MonitorIcon = () => /* @__PURE__ */ jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsx("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2", ry: "2" }),
  /* @__PURE__ */ jsx("line", { x1: "8", y1: "21", x2: "16", y2: "21" }),
  /* @__PURE__ */ jsx("line", { x1: "12", y1: "17", x2: "12", y2: "21" })
] });
const ChatIcon = () => /* @__PURE__ */ jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) });
const CodeIcon = () => /* @__PURE__ */ jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsx("polyline", { points: "16 18 22 12 16 6" }),
  /* @__PURE__ */ jsx("polyline", { points: "8 6 2 12 8 18" })
] });
function AgoraVideoTrack({ track, className, style }) {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!track || !containerRef.current) return;
    track.play(containerRef.current);
    return () => {
      try {
        track.stop();
      } catch {
      }
    };
  }, [track]);
  return /* @__PURE__ */ jsx("div", { ref: containerRef, className, style: { width: "100%", height: "100%", ...style } });
}
function CodeEditor({ value, language }) {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const lineCount = Math.max(value.split("\n").length, 12);
  const syncScroll = useCallback(() => {
    if (!textareaRef.current || !lineNumbersRef.current) return;
    lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "w-full h-full rounded-2xl border border-white/10 bg-slate-950 overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-white/10 bg-black/20 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/40", children: [
      /* @__PURE__ */ jsx("span", { children: toMonacoLanguage(language) }),
      /* @__PURE__ */ jsx("span", { children: "Read only · Candidate view" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex h-[calc(100%-37px)]", children: [
      /* @__PURE__ */ jsx("div", { ref: lineNumbersRef, className: "select-none overflow-hidden border-r border-white/10 bg-black/20 px-3 py-3 text-right font-mono text-xs leading-6 text-white/30", children: Array.from({ length: lineCount }, (_, i) => /* @__PURE__ */ jsx("div", { children: i + 1 }, i + 1)) }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          ref: textareaRef,
          "aria-label": `${language} code viewer`,
          spellCheck: false,
          readOnly: true,
          onScroll: syncScroll,
          className: "h-full w-full resize-none bg-transparent px-4 py-3 font-mono text-sm leading-6 text-white outline-none",
          style: { tabSize: 4 },
          value
        }
      )
    ] })
  ] });
}
function InterviewRoomPage() {
  const { token, user, roomId, roomInfo } = useLoaderData();
  const initialWindow = (roomInfo == null ? void 0 : roomInfo.sessionWindow) || {
    scheduledStartTime: roomInfo == null ? void 0 : roomInfo.scheduledAt,
    activationTime: new Date(new Date(roomInfo == null ? void 0 : roomInfo.scheduledAt).getTime() - 10 * 60 * 1e3).toISOString(),
    endTime: new Date(new Date(roomInfo == null ? void 0 : roomInfo.scheduledAt).getTime() + Number((roomInfo == null ? void 0 : roomInfo.durationMinutes) || 60) * 60 * 1e3).toISOString(),
    gracePeriodEndTime: new Date(new Date(roomInfo == null ? void 0 : roomInfo.scheduledAt).getTime() + (Number((roomInfo == null ? void 0 : roomInfo.durationMinutes) || 60) + 10) * 60 * 1e3).toISOString()
  };
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localScreenTrack, setLocalScreenTrack] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [remoteScreenSharerId, setRemoteScreenSharerId] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showIDE, setShowIDE] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [hasLeft, setHasLeft] = useState(false);
  const [unreadChat, setUnreadChat] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [error, setError] = useState("");
  const [tabSwitchAlerts, setTabSwitchAlerts] = useState([]);
  const [elapsed, setElapsed] = useState("00:00");
  const [nowMs, setNowMs] = useState(Date.now());
  const [sessionWindow, setSessionWindow] = useState(initialWindow);
  const [extensionNotice, setExtensionNotice] = useState("");
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(DEFAULT_CODE.python);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [showConsole, setShowConsole] = useState(true);
  const [candidateIsRunning, setCandidateIsRunning] = useState(false);
  const [candidateStdin, setCandidateStdin] = useState("");
  const [candidateTyping, setCandidateTyping] = useState(false);
  const agoraClientRef = useRef(null);
  const screenShareClientRef = useRef(null);
  const localAudioTrackRef = useRef(null);
  const localVideoTrackRef = useRef(null);
  const localScreenTrackRef = useRef(null);
  const screenShareUidRef = useRef(null);
  const ablyClientRef = useRef(null);
  const ablyChannelRef = useRef(null);
  const agoraJoinInfoRef = useRef({
    appId: "",
    token: null,
    channelName: ""
  });
  const candidateTypingTimer = useRef(null);
  const startTimeRef = useRef(Date.now());
  const showChatRef = useRef(false);
  const currentUser = user;
  const currentUserId = currentUser.id ?? currentUser.$id ?? "";
  const deriveStatus = useCallback((win) => {
    const activation = new Date(win.activationTime).getTime();
    const end = new Date(win.endTime).getTime();
    const graceEnd = new Date(win.gracePeriodEndTime).getTime();
    if (nowMs < activation) return "waiting_for_start";
    if (nowMs <= end) return "active";
    if (nowMs <= graceEnd) return "grace_period";
    return "ended";
  }, [nowMs]);
  const sessionStatus = deriveStatus(sessionWindow);
  const showEndingSoon = sessionStatus === "active" && new Date(sessionWindow.endTime).getTime() - nowMs <= FIVE_MINUTES_MS;
  useEffect(() => {
    showChatRef.current = showChat;
  }, [showChat]);
  useEffect(() => {
    const tick = setInterval(() => setNowMs(Date.now()), 1e3);
    return () => clearInterval(tick);
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = Math.floor((Date.now() - startTimeRef.current) / 1e3);
      const h = Math.floor(diff / 3600);
      const m = Math.floor(diff % 3600 / 60);
      const s = diff % 60;
      setElapsed(h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    }, 1e3);
    return () => clearInterval(timer);
  }, []);
  const sendSignal = useCallback((type, data, targetId) => {
    var _a;
    (_a = ablyChannelRef.current) == null ? void 0 : _a.publish(type, {
      id: Math.random().toString(36).slice(2),
      roomId,
      senderId: currentUserId,
      senderName: currentUser.name || "Recruiter",
      receiverId: targetId || "broadcast",
      type,
      payload: JSON.stringify(data ?? {}),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      $createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }, [roomId, currentUserId, currentUser.name]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStatus === "waiting_for_start" || sessionStatus === "ended") return;
    let cancelled = false;
    const init = async () => {
      try {
        const joinRes = await api.interviews.join(token, roomInfo.interviewId);
        const joinData = joinRes.data || joinRes;
        if (cancelled) return;
        if (joinData.sessionWindow) setSessionWindow(joinData.sessionWindow);
        const agoraAppId = joinData.agoraAppId;
        const agoraToken = joinData.agoraToken;
        const channelName = joinData.channelName;
        agoraJoinInfoRef.current = { appId: agoraAppId, token: agoraToken, channelName };
        if (!agoraAppId || !channelName) {
          throw new Error("Interview video service is not configured.");
        }
        const AblyModule = await import("ably");
        const Ably = AblyModule.default || AblyModule;
        const ablyClient = new Ably.Realtime({
          authUrl: `/api/v1/interview-signal/rooms/${roomId}/ably-token`,
          authHeaders: { Authorization: `Bearer ${token}` }
        });
        ablyClientRef.current = ablyClient;
        const channel = ablyClient.channels.get(`interview:${roomId}`);
        ablyChannelRef.current = channel;
        channel.subscribe((msg) => {
          var _a;
          if (cancelled) return;
          const signal = { ...msg.data, type: ((_a = msg.data) == null ? void 0 : _a.type) || msg.name };
          if (signal.senderId === currentUserId) return;
          const rawPayload = signal.payload ?? "{}";
          const data = typeof rawPayload === "string" ? (() => {
            try {
              return JSON.parse(rawPayload);
            } catch {
              return {};
            }
          })() : rawPayload;
          if (signal.type === "chat") {
            const msgId = signal.id || String(Date.now());
            setChatMessages((prev) => {
              if (prev.some((m) => m.id === msgId)) return prev;
              return [...prev, { id: msgId, sender: data.senderName || signal.senderName || "Candidate", text: data.text || "", time: new Date(signal.createdAt || Date.now()).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) }];
            });
            if (!showChatRef.current) setUnreadChat((n) => n + 1);
          } else if (signal.type === "code_update") {
            if (data.language && data.code !== void 0) {
              setLanguage(data.language);
              setCode(data.code);
            }
            setCandidateTyping(true);
            if (candidateTypingTimer.current) clearTimeout(candidateTypingTimer.current);
            candidateTypingTimer.current = setTimeout(() => setCandidateTyping(false), 2e3);
          } else if (signal.type === "code_output") {
            setConsoleOutput(Array.isArray(data.lines) ? data.lines.map((line) => String(line)) : []);
            setCandidateIsRunning(Boolean(data.isRunning));
            setCandidateStdin(typeof data.stdin === "string" ? data.stdin : "");
            if (typeof data.language === "string" && data.language) {
              setLanguage(data.language);
            }
            setShowConsole(true);
          } else if (signal.type === "tab_switch") {
            const candidateName = data.senderName || signal.senderName || "Candidate";
            const alertTime = new Date(signal.createdAt || Date.now()).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
            setTabSwitchAlerts((prev) => [...prev, { id: Date.now(), name: candidateName, time: alertTime }]);
            setTimeout(() => setTabSwitchAlerts((prev) => prev.slice(1)), 8e3);
          } else if (signal.type === "interview_time_extended") {
            if (data.newEndTime) {
              const endMs = new Date(data.newEndTime).getTime();
              setSessionWindow((prev) => ({ ...prev, endTime: new Date(endMs).toISOString(), gracePeriodEndTime: new Date(endMs + 10 * 60 * 1e3).toISOString() }));
            }
            if (Number(data.addedMinutes || 0) > 0) {
              setExtensionNotice(`Interview extended by ${data.addedMinutes} minutes.`);
              setTimeout(() => setExtensionNotice(""), 5e3);
            }
          } else if (signal.type === "screen_share_started") {
            setRemoteScreenSharerId(String(data.screenUid || signal.senderId || ""));
          } else if (signal.type === "screen_share_stopped") {
            setRemoteScreenSharerId((prev) => prev === String(data.screenUid || signal.senderId || "") ? null : prev);
          }
        });
        const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        agoraClientRef.current = client;
        client.on("user-published", async (remoteUser, mediaType) => {
          var _a;
          await client.subscribe(remoteUser, mediaType);
          if (mediaType === "audio") (_a = remoteUser.audioTrack) == null ? void 0 : _a.play();
          setRemoteUsers((prev) => {
            const idx = prev.findIndex((u) => u.uid === remoteUser.uid);
            if (idx >= 0) {
              const n = [...prev];
              n[idx] = remoteUser;
              return n;
            }
            return [...prev, remoteUser];
          });
        });
        client.on("user-unpublished", (remoteUser) => {
          setRemoteUsers((prev) => prev.map((u) => u.uid === remoteUser.uid ? remoteUser : u));
        });
        client.on("user-left", (remoteUser) => {
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== remoteUser.uid));
          setRemoteScreenSharerId((prev) => prev === String(remoteUser.uid) ? null : prev);
        });
        client.on("connection-state-change", (curState) => {
          if (!cancelled) {
            if (curState === "CONNECTED") setConnectionStatus("connected");
            else if (curState === "CONNECTING" || curState === "RECONNECTING") setConnectionStatus("connecting");
            else if (curState === "DISCONNECTED") setConnectionStatus("disconnected");
          }
        });
        await client.join(agoraAppId, channelName, agoraToken, null);
        if (cancelled) return;
        let audioTrack = null;
        let videoTrack = null;
        const mediaIssues = [];
        try {
          audioTrack = await AgoraRTC.createMicrophoneAudioTrack({ encoderConfig: "high_quality" });
          localAudioTrackRef.current = audioTrack;
        } catch {
          setIsMuted(true);
          mediaIssues.push("Microphone unavailable. Joined muted.");
        }
        try {
          videoTrack = await AgoraRTC.createCameraVideoTrack({ encoderConfig: "720p_2" });
          localVideoTrackRef.current = videoTrack;
          if (!cancelled) setLocalVideoTrack(videoTrack);
        } catch {
          setIsCameraOff(true);
          mediaIssues.push("Camera unavailable.");
        }
        const toPublish = [audioTrack, videoTrack].filter(Boolean);
        if (toPublish.length > 0) await client.publish(toPublish);
        if (!cancelled) {
          setConnectionStatus("connected");
          if (mediaIssues.length > 0) setError(mediaIssues.join(" "));
        }
      } catch (err) {
        if (!cancelled) {
          setConnectionStatus("disconnected");
          setError((err == null ? void 0 : err.message) || "Could not initialize the interview room");
        }
      }
    };
    init();
    return () => {
      var _a, _b, _c, _d;
      cancelled = true;
      [localAudioTrackRef.current, localVideoTrackRef.current, localScreenTrackRef.current].filter(Boolean).forEach((t) => {
        try {
          t.stop();
          t.close();
        } catch {
        }
      });
      (_a = agoraClientRef.current) == null ? void 0 : _a.leave().catch(() => {
      });
      (_b = screenShareClientRef.current) == null ? void 0 : _b.leave().catch(() => {
      });
      agoraClientRef.current = null;
      screenShareClientRef.current = null;
      screenShareUidRef.current = null;
      localAudioTrackRef.current = null;
      localVideoTrackRef.current = null;
      localScreenTrackRef.current = null;
      try {
        (_c = ablyChannelRef.current) == null ? void 0 : _c.unsubscribe();
      } catch {
      }
      try {
        (_d = ablyClientRef.current) == null ? void 0 : _d.close();
      } catch {
      }
      ablyChannelRef.current = null;
      ablyClientRef.current = null;
      if (candidateTypingTimer.current) clearTimeout(candidateTypingTimer.current);
    };
  }, [sessionStatus]);
  const toggleMute = async () => {
    const audioTrack = localAudioTrackRef.current;
    if (!audioTrack) return;
    const newMuted = !isMuted;
    await audioTrack.setEnabled(!newMuted);
    setIsMuted(newMuted);
    setError("");
    sendSignal("mute_status", { isMuted: newMuted, isCameraOff });
  };
  const toggleCamera = async () => {
    const videoTrack = localVideoTrackRef.current;
    if (!videoTrack) return;
    const newOff = !isCameraOff;
    await videoTrack.setEnabled(!newOff);
    setIsCameraOff(newOff);
    if (!newOff) setError("");
    sendSignal("mute_status", { isMuted, isCameraOff: newOff });
  };
  const stopScreenShare = async (shouldNotify = true) => {
    var _a, _b;
    const screenTrack = localScreenTrackRef.current;
    const screenClient = screenShareClientRef.current;
    const screenUid = screenShareUidRef.current;
    if (screenTrack) {
      try {
        await ((_a = screenClient == null ? void 0 : screenClient.unpublish) == null ? void 0 : _a.call(screenClient, [screenTrack]));
      } catch {
      }
      try {
        screenTrack.stop();
        screenTrack.close();
      } catch {
      }
    }
    await ((_b = screenClient == null ? void 0 : screenClient.leave) == null ? void 0 : _b.call(screenClient).catch(() => {
    }));
    localScreenTrackRef.current = null;
    screenShareClientRef.current = null;
    screenShareUidRef.current = null;
    setLocalScreenTrack(null);
    setIsScreenSharing(false);
    if (shouldNotify) {
      sendSignal("screen_share_stopped", { screenUid });
    }
  };
  const toggleScreenShare = async () => {
    var _a;
    const client = agoraClientRef.current;
    if (!client) return;
    if (isScreenSharing) {
      await stopScreenShare(true);
    } else {
      try {
        const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
        const { appId, token: agoraToken, channelName } = agoraJoinInfoRef.current;
        if (!appId || !channelName) {
          throw new Error("Screen sharing is unavailable right now.");
        }
        const screenClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        const screenUid = await screenClient.join(appId, channelName, agoraToken, null);
        const screenTrack = await AgoraRTC.createScreenVideoTrack({ encoderConfig: "1080p_1" }, "disable");
        await screenClient.publish([screenTrack]);
        screenShareClientRef.current = screenClient;
        screenShareUidRef.current = String(screenUid);
        localScreenTrackRef.current = screenTrack;
        setLocalScreenTrack(screenTrack);
        setIsScreenSharing(true);
        sendSignal("screen_share_started", { screenUid: String(screenUid) });
        (_a = screenTrack.on) == null ? void 0 : _a.call(screenTrack, "track-ended", async () => {
          await stopScreenShare(true);
        });
      } catch (err) {
        if ((err == null ? void 0 : err.name) !== "NotAllowedError") setError((err == null ? void 0 : err.message) || "Could not start screen sharing.");
      }
    }
  };
  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { id: Date.now().toString(), sender: (currentUser.name || "You") + " (You)", text, time: (/* @__PURE__ */ new Date()).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) }]);
    sendSignal("chat", { text, senderName: currentUser.name });
  };
  const leaveRoom = async () => {
    var _a, _b, _c, _d, _e;
    if (isScreenSharing) {
      await stopScreenShare(false);
    }
    [localAudioTrackRef.current, localVideoTrackRef.current].filter(Boolean).forEach((t) => {
      try {
        t.stop();
        t.close();
      } catch {
      }
    });
    await ((_a = agoraClientRef.current) == null ? void 0 : _a.leave().catch(() => {
    }));
    await ((_c = (_b = screenShareClientRef.current) == null ? void 0 : _b.leave) == null ? void 0 : _c.call(_b).catch(() => {
    }));
    try {
      (_d = ablyChannelRef.current) == null ? void 0 : _d.unsubscribe();
    } catch {
    }
    try {
      (_e = ablyClientRef.current) == null ? void 0 : _e.close();
    } catch {
    }
    setHasLeft(true);
  };
  const endInterview = async () => {
    setIsEnding(true);
    try {
      await api.interviews.update(token, roomInfo.interviewId, { status: "completed" });
      await leaveRoom();
    } catch (err) {
      setError((err == null ? void 0 : err.message) || "Could not end interview");
    } finally {
      setIsEnding(false);
      setConfirmEnd(false);
    }
  };
  const extendInterview = async (minutes) => {
    setIsExtending(true);
    try {
      await api.interviews.extend(token, roomInfo.interviewId, minutes);
    } catch (err) {
      setError((err == null ? void 0 : err.message) || "Could not extend interview");
    } finally {
      setIsExtending(false);
    }
  };
  if (roomInfo == null ? void 0 : roomInfo.error) return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-950 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center p-8", children: [
    /* @__PURE__ */ jsx("div", { className: "text-red-400 text-5xl mb-4", children: "⚠️" }),
    /* @__PURE__ */ jsx("h1", { className: "text-white text-xl font-semibold mb-2", children: "Room Not Found" }),
    /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm mb-6", children: roomInfo.error }),
    /* @__PURE__ */ jsx("button", { onClick: () => window.history.back(), className: "px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700", children: "Go Back" })
  ] }) });
  if (hasLeft) return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-950 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center p-8", children: [
    /* @__PURE__ */ jsx("div", { className: "text-5xl mb-4", children: "👋" }),
    /* @__PURE__ */ jsx("h1", { className: "text-white text-xl font-semibold mb-2", children: "You've left the interview" }),
    /* @__PURE__ */ jsx("button", { onClick: () => window.history.back(), className: "px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700", children: "Go Back" })
  ] }) });
  const selfInitials = (currentUser.name || "R").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const screenSharerUser = remoteScreenSharerId ? remoteUsers.find((remoteUser) => String(remoteUser.uid) === remoteScreenSharerId) || null : null;
  const mainRemoteUser = remoteUsers.find((remoteUser) => String(remoteUser.uid) !== remoteScreenSharerId) || remoteUsers[0] || null;
  const activeScreenTrack = localScreenTrack ?? (screenSharerUser == null ? void 0 : screenSharerUser.videoTrack) ?? null;
  const isShowingScreenShare = Boolean(activeScreenTrack);
  return /* @__PURE__ */ jsxs("div", { className: "bg-gray-950 select-none", style: { height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }, children: [
    confirmEnd && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-black/80 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-white text-xl font-bold mb-2", children: "End Interview?" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm mb-6", children: "This will end the session for all participants." }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 justify-center", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setConfirmEnd(false), className: "px-5 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 text-sm", children: "Cancel" }),
        /* @__PURE__ */ jsx("button", { onClick: endInterview, disabled: isEnding, className: "px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm disabled:opacity-50", children: isEnding ? "Ending…" : "End Interview" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "fixed top-4 right-4 z-40 flex flex-col gap-2", children: tabSwitchAlerts.map((a) => /* @__PURE__ */ jsxs("div", { className: "bg-red-900/90 border border-red-500/50 rounded-xl px-4 py-2 text-white text-xs shadow-lg", children: [
      "⚠️ ",
      /* @__PURE__ */ jsx("strong", { children: a.name }),
      " switched tabs at ",
      a.time
    ] }, a.id)) }),
    /* @__PURE__ */ jsxs("div", { style: { flexShrink: 0 }, className: "flex items-center justify-between px-5 py-2.5 bg-gray-900/90 border-b border-white/5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-white font-semibold text-sm", children: "CareerNest Interview" }),
        /* @__PURE__ */ jsx("span", { className: `text-xs px-2 py-0.5 rounded-full ${connectionStatus === "connected" ? "bg-green-500/20 text-green-400" : connectionStatus === "connecting" ? "bg-yellow-500/20 text-yellow-400 animate-pulse" : "bg-red-500/20 text-red-400"}`, children: connectionStatus === "connected" ? "Connected" : connectionStatus === "connecting" ? "Connecting…" : "Disconnected" }),
        showEndingSoon && /* @__PURE__ */ jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400", children: "Ending soon" }),
        extensionNotice && /* @__PURE__ */ jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400", children: extensionNotice })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-gray-500 text-xs", children: [
          remoteUsers.length + 1,
          " participant",
          remoteUsers.length !== 0 ? "s" : "",
          " · ",
          elapsed
        ] }),
        ["30", "45", "60"].map((m) => /* @__PURE__ */ jsxs("button", { onClick: () => extendInterview(Number(m)), disabled: isExtending, className: "text-xs px-2 py-0.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 disabled:opacity-50 transition-colors", children: [
          "+",
          m,
          "m"
        ] }, m)),
        /* @__PURE__ */ jsx("button", { onClick: () => setConfirmEnd(true), className: "text-xs px-3 py-1 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/40 transition-colors", children: "End" })
      ] })
    ] }),
    error && /* @__PURE__ */ jsx("div", { style: { flexShrink: 0 }, className: "bg-red-900/50 border-b border-red-500/30 px-5 py-2 text-red-300 text-sm text-center", children: error }),
    /* @__PURE__ */ jsxs("div", { style: { flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }, children: [
      /* @__PURE__ */ jsxs("div", { className: "relative bg-gray-900 overflow-hidden", style: showIDE ? { width: "38%", flexShrink: 0, display: "flex", flexDirection: "column" } : { flex: 1, display: "flex", flexDirection: "column" }, children: [
        isShowingScreenShare ? /* @__PURE__ */ jsxs("div", { style: { flex: 1, display: "flex", overflow: "hidden" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { flex: 1, position: "relative", background: "#000", overflow: "hidden" }, children: [
            /* @__PURE__ */ jsx(AgoraVideoTrack, { track: activeScreenTrack, className: "w-full h-full object-contain" }),
            /* @__PURE__ */ jsxs("div", { className: "absolute top-3 left-3 flex items-center gap-1.5 bg-blue-600/90 text-white text-xs px-2.5 py-1 rounded-full", children: [
              /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 bg-white rounded-full animate-pulse" }),
              localScreenTrack ? "You're sharing your screen" : "Candidate is sharing their screen"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-950 border-l border-white/10 overflow-y-auto", style: { width: 148, flexShrink: 0, display: "flex", flexDirection: "column", gap: 8, padding: 8 }, children: [
            /* @__PURE__ */ jsxs("div", { className: "relative rounded-xl overflow-hidden border border-white/10 bg-gray-800", style: { aspectRatio: "16/9", width: "100%" }, children: [
              localVideoTrack && !isCameraOff ? /* @__PURE__ */ jsx(AgoraVideoTrack, { track: localVideoTrack, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-gray-800", children: /* @__PURE__ */ jsx("span", { className: "text-white text-lg font-bold", children: selfInitials }) }),
              /* @__PURE__ */ jsx("div", { className: "absolute bottom-1 left-1.5", children: /* @__PURE__ */ jsx("span", { className: "text-white text-[10px] bg-black/60 px-1 py-0.5 rounded", children: "You" }) })
            ] }),
            mainRemoteUser && /* @__PURE__ */ jsxs("div", { className: "relative rounded-xl overflow-hidden border border-white/10 bg-gray-800", style: { aspectRatio: "16/9", width: "100%" }, children: [
              mainRemoteUser.videoTrack ? /* @__PURE__ */ jsx(AgoraVideoTrack, { track: mainRemoteUser.videoTrack, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-gray-800", children: /* @__PURE__ */ jsx("span", { className: "text-white text-lg font-bold", children: "C" }) }),
              /* @__PURE__ */ jsx("div", { className: "absolute bottom-1 left-1.5", children: /* @__PURE__ */ jsx("span", { className: "text-white text-[10px] bg-black/60 px-1 py-0.5 rounded", children: "Candidate" }) })
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxs("div", { style: { flex: 1, position: "relative", overflow: "hidden" }, children: [
          (mainRemoteUser == null ? void 0 : mainRemoteUser.videoTrack) ? /* @__PURE__ */ jsx(AgoraVideoTrack, { track: mainRemoteUser.videoTrack, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-gray-900", children: mainRemoteUser ? /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-full bg-violet-600 flex items-center justify-center text-white text-3xl font-bold mx-auto", children: "C" }),
            /* @__PURE__ */ jsx("p", { className: "text-white/60 text-sm mt-3", children: "Candidate" }),
            /* @__PURE__ */ jsx("p", { className: "text-white/30 text-xs", children: "Camera off" })
          ] }) : /* @__PURE__ */ jsx("p", { className: "text-white/40 text-sm", children: "Waiting for candidate to join..." }) }),
          mainRemoteUser && /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 left-4", children: /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-black/60 rounded text-white text-xs backdrop-blur-sm", children: "Candidate" }) }),
          /* @__PURE__ */ jsxs("div", { className: "absolute rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl bg-gray-800", style: { bottom: 16, right: 16, width: 180, height: 120, zIndex: 10 }, children: [
            localVideoTrack && !isCameraOff ? /* @__PURE__ */ jsx(AgoraVideoTrack, { track: localVideoTrack, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-gray-900", children: /* @__PURE__ */ jsx("span", { className: "text-white text-lg font-bold", children: selfInitials }) }),
            /* @__PURE__ */ jsxs("div", { className: "absolute bottom-1 left-1 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-black/60 rounded text-white text-xs backdrop-blur-sm", children: "You" }),
              isMuted && /* @__PURE__ */ jsx("span", { className: "w-5 h-5 bg-red-500/80 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(MicIcon, { off: true }) })
            ] })
          ] })
        ] }),
        showChat && /* @__PURE__ */ jsxs("div", { className: "absolute top-0 right-0 bottom-0 border-l border-white/10 flex flex-col", style: { width: 280, zIndex: 20, backgroundColor: "#0b0b0b" }, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0", style: { backgroundColor: "#0b0b0b" }, children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", style: { color: "#ffffff" }, children: "Chat" }),
            /* @__PURE__ */ jsx("button", { onClick: () => setShowChat(false), className: "text-white/40 hover:text-white text-xl leading-none", children: "×" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-3 space-y-3", style: { backgroundColor: "#0b0b0b" }, children: [
            chatMessages.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-white/25 text-xs text-center mt-6", children: "No messages yet" }),
            chatMessages.map((m) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mb-0.5", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", style: { color: "#aaaaaa" }, children: m.sender }),
                /* @__PURE__ */ jsx("span", { className: "text-white/25 text-[10px]", children: m.time })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs rounded-lg px-2.5 py-1.5", style: { color: "#ffffff", backgroundColor: "#1a1a1a" }, children: m.text })
            ] }, m.id))
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-3 border-t border-white/10 flex gap-2 flex-shrink-0", style: { backgroundColor: "#0b0b0b" }, children: [
            /* @__PURE__ */ jsx("input", { type: "text", value: chatInput, onChange: (e) => setChatInput(e.target.value), onKeyDown: (e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendChat();
              }
            }, placeholder: "Type a message…", className: "flex-1 text-xs px-2.5 py-2 rounded-lg focus:outline-none focus:border-blue-500 placeholder-white/25", style: { backgroundColor: "#111111", color: "#ffffff", border: "1px solid #333" } }),
            /* @__PURE__ */ jsx("button", { onClick: sendChat, disabled: !chatInput.trim(), className: "px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors", children: "→" })
          ] })
        ] })
      ] }),
      showIDE && /* @__PURE__ */ jsxs("div", { className: "bg-gray-950 border-l border-white/10", style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }, children: [
        /* @__PURE__ */ jsxs("div", { style: { flexShrink: 0 }, className: "flex items-center gap-3 px-4 py-2.5 bg-gray-900 border-b border-white/5", children: [
          /* @__PURE__ */ jsx("span", { className: "text-white/60 text-xs font-medium", children: "Candidate's Code" }),
          /* @__PURE__ */ jsx("span", { className: "text-white/40 text-xs px-2 py-0.5 rounded bg-white/5", children: language }),
          candidateTyping && /* @__PURE__ */ jsx("span", { className: "text-blue-400 text-xs animate-pulse", children: "Candidate is typing…" }),
          candidateIsRunning && /* @__PURE__ */ jsx("span", { className: "text-green-400 text-xs animate-pulse", children: "Running…" }),
          /* @__PURE__ */ jsx("div", { style: { flex: 1 } }),
          /* @__PURE__ */ jsx("button", { onClick: () => setShowConsole((v) => !v), title: "Toggle console", className: `px-2.5 py-1.5 text-xs rounded-lg transition-colors ${showConsole ? "bg-blue-600/30 text-blue-400" : "bg-white/5 text-white/40 hover:text-white"}`, children: "Console" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setShowIDE(false), title: "Close", className: "w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-white/40 hover:text-white flex items-center justify-center transition-colors", children: "✕" })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { flex: showConsole ? 0.65 : 1, minHeight: 0, overflow: "hidden" }, children: /* @__PURE__ */ jsx(CodeEditor, { value: code, language }) }),
        showConsole && /* @__PURE__ */ jsxs("div", { className: "border-t border-white/10", style: { flex: 0.35, display: "flex", flexDirection: "column", minHeight: 0 }, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-3 py-1.5 bg-gray-900/80 border-b border-white/5 flex-shrink-0", children: [
            /* @__PURE__ */ jsx("span", { className: "text-white/40 text-xs font-medium", children: "Console Output" }),
            candidateIsRunning ? /* @__PURE__ */ jsx("span", { className: "text-green-400 text-[11px] animate-pulse", children: "Running…" }) : null
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 border-b border-white/5 bg-gray-900/70", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-white/40 text-[11px] mb-1", children: "Stdin used by candidate" }),
            /* @__PURE__ */ jsx("div", { className: "min-h-[44px] rounded border border-white/10 bg-black/30 px-2 py-1.5 text-xs text-white/70 whitespace-pre-wrap", children: candidateStdin || "No stdin provided" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-3 font-mono text-xs", style: { background: "#0d1117" }, children: candidateIsRunning ? /* @__PURE__ */ jsx("p", { className: "text-green-300", children: "Candidate is running the code..." }) : consoleOutput.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-white/20", children: "Candidate output will appear here after they run the code." }) : consoleOutput.map((line, index) => /* @__PURE__ */ jsx("div", { className: `py-0.5 ${line.startsWith("Error") ? "text-red-400" : line.startsWith("Warn") ? "text-yellow-400" : "text-green-300"}`, children: line }, `${line}-${index}`)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { flexShrink: 0 }, className: "bg-gray-900/95 border-t border-white/10 px-6 py-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsx("button", { onClick: toggleMute, title: isMuted ? "Unmute" : "Mute", className: `w-12 h-12 rounded-full flex items-center justify-center transition-all text-white ${isMuted ? "bg-red-500 hover:bg-red-600" : "bg-white/10 hover:bg-white/20"}`, children: /* @__PURE__ */ jsx(MicIcon, { off: isMuted }) }),
        /* @__PURE__ */ jsx("button", { onClick: toggleCamera, title: isCameraOff ? "Camera on" : "Camera off", className: `w-12 h-12 rounded-full flex items-center justify-center transition-all text-white ${isCameraOff ? "bg-red-500 hover:bg-red-600" : "bg-white/10 hover:bg-white/20"}`, children: /* @__PURE__ */ jsx(CamIcon, { off: isCameraOff }) }),
        /* @__PURE__ */ jsx("button", { onClick: toggleScreenShare, title: isScreenSharing ? "Stop sharing" : "Share screen", className: `w-12 h-12 rounded-full flex items-center justify-center transition-all text-white ${isScreenSharing ? "bg-blue-500 hover:bg-blue-600" : "bg-white/10 hover:bg-white/20"}`, children: /* @__PURE__ */ jsx(MonitorIcon, {}) }),
        /* @__PURE__ */ jsxs("button", { onClick: () => {
          setShowChat((v) => {
            const n = !v;
            if (n) setUnreadChat(0);
            return n;
          });
        }, title: "Chat", className: `relative w-12 h-12 rounded-full flex items-center justify-center transition-all text-white ${showChat ? "bg-blue-500 hover:bg-blue-600" : "bg-white/10 hover:bg-white/20"}`, children: [
          /* @__PURE__ */ jsx(ChatIcon, {}),
          unreadChat > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold", children: unreadChat })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowIDE((v) => !v), title: showIDE ? "Close Code View" : "View Candidate's Code", className: `w-12 h-12 rounded-full flex items-center justify-center transition-all text-white ${showIDE ? "bg-blue-500 hover:bg-blue-600" : "bg-white/10 hover:bg-white/20"}`, children: /* @__PURE__ */ jsx(CodeIcon, {}) }),
        /* @__PURE__ */ jsx("button", { onClick: leaveRoom, title: "Leave", className: "w-16 h-12 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 transition-colors ml-4 text-xs", children: "Leave" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setConfirmEnd(true), title: "End Interview", className: "w-16 h-12 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors text-xs", children: "End" })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-center text-white/15 text-[10px] mt-1.5", children: [
        "Room: ",
        roomId
      ] })
    ] })
  ] });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: InterviewRoomPage,
  loader: loader$c,
  meta: meta$6
}, Symbol.toStringTag, { value: "Module" }));
function isCompanyUser(user) {
  return user.role === "company" && typeof user.tenantId === "string" && typeof user.companyId === "string";
}
function mapCompanyProfile(doc) {
  var _a, _b;
  const colleges = doc.colleges;
  const relationTenantId = Array.isArray(colleges) ? String(((_a = colleges[0]) == null ? void 0 : _a.$id) ?? colleges[0] ?? "") : String((colleges == null ? void 0 : colleges.$id) ?? colleges ?? "");
  const relationCollegeName = Array.isArray(colleges) ? String(((_b = colleges[0]) == null ? void 0 : _b.name) ?? "") : String((colleges == null ? void 0 : colleges.name) ?? "");
  return {
    id: String(doc.$id ?? doc.id ?? ""),
    tenantId: String(doc.tenantId ?? relationTenantId ?? ""),
    collegeName: relationCollegeName,
    name: String(doc.name ?? ""),
    contactEmail: String(doc.contactEmail ?? doc.email ?? ""),
    contactPhone: String(doc.contactPhone ?? doc.phone ?? ""),
    contactPerson: String(doc.contactPerson ?? ""),
    status: String(doc.status ?? "active"),
    createdAt: String(doc.$createdAt ?? ""),
    updatedAt: String(doc.$updatedAt ?? "")
  };
}
function mapCompanyDrive(doc, company) {
  return {
    id: String(doc.$id ?? doc.id ?? ""),
    companyId: company.id,
    companyName: company.name,
    title: String(doc.title ?? ""),
    status: String(doc.status ?? "draft"),
    jobLevel: String(doc.jobLevel ?? ""),
    jobType: String(doc.jobType ?? ""),
    experience: String(doc.experience ?? ""),
    ctcPeriod: String(doc.ctcPeriod ?? "annual"),
    location: String(doc.location ?? ""),
    vacancies: Number(doc.vacancies ?? 0),
    description: String(doc.description ?? ""),
    salary: Number(doc.salary ?? 0),
    deadline: String(doc.deadline ?? ""),
    department: Array.isArray(doc.department) ? doc.department.map((item) => String(item)) : doc.department ? [String(doc.department)] : [],
    studyingYear: String(doc.studyingYear ?? ""),
    externalLink: String(doc.externalLink ?? ""),
    CGPA: Number(doc.CGPA ?? 0),
    Backlogs: Number(doc.Backlogs ?? 0),
    createdAt: String(doc.$createdAt ?? ""),
    updatedAt: String(doc.$updatedAt ?? "")
  };
}
function summarizeApplications(documents, total) {
  const summary = {
    total,
    applied: 0,
    underReview: 0,
    shortlisted: 0,
    interviewScheduled: 0,
    selected: 0,
    rejected: 0
  };
  for (const application of documents) {
    switch (application.stage) {
      case "under_review":
        summary.underReview += 1;
        break;
      case "shortlisted":
        summary.shortlisted += 1;
        break;
      case "interview_scheduled":
        summary.interviewScheduled += 1;
        break;
      case "selected":
        summary.selected += 1;
        break;
      case "rejected":
        summary.rejected += 1;
        break;
      default:
        summary.applied += 1;
        break;
    }
  }
  return summary;
}
async function requireCompanyContext(request2) {
  const { token, user } = await requireCompanyUserSession(request2);
  try {
    const companyRes = await api.companies.getById(token, user.companyId);
    return {
      token,
      user,
      company: mapCompanyProfile(companyRes.data || {})
    };
  } catch {
    throw await logout(request2);
  }
}
async function requireCompanyUserSession(request2) {
  const { token, user } = await requireUserSession(request2);
  if (!isCompanyUser(user)) {
    throw await logout(request2);
  }
  return { token, user };
}
async function loadCompanyDrives(token, user, company) {
  const drivesRes = await api.drives.list(token, `tenantId=${user.tenantId}&companyId=${user.companyId}&limit=500`).catch(() => ({ data: [], total: 0 }));
  return (drivesRes.data || []).map((drive) => mapCompanyDrive(drive, company));
}
async function loadDriveApplicationSummaries(token, drives) {
  const entries = await Promise.all(
    drives.map(async (drive) => {
      const response = await api.applications.list(token, `driveId=${drive.id}&limit=500`).catch(() => ({ data: [], total: 0 }));
      const documents = response.data || [];
      return [
        drive.id,
        summarizeApplications(documents, response.total ?? documents.length)
      ];
    })
  );
  return Object.fromEntries(entries);
}
function getPathnameLower(url) {
  try {
    return new URL(url, "http://localhost").pathname.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}
function isImageUrl(pathname) {
  return /\.(png|jpe?g|webp|gif|bmp|svg)$/.test(pathname);
}
function isPdfUrl(pathname) {
  return pathname.endsWith(".pdf");
}
function loadPdfJs() {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (window.__pdfjsLoadPromise) return window.__pdfjsLoadPromise;
  window.__pdfjsLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-pdfjs="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.pdfjsLib));
      existing.addEventListener("error", () => reject(new Error("Failed to load PDF.js")));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.dataset.pdfjs = "true";
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(window.pdfjsLib);
      } else {
        reject(new Error("PDF.js not available on window"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load PDF.js"));
    document.head.appendChild(script);
  });
  return window.__pdfjsLoadPromise;
}
function InlineCertificateViewer({
  url,
  title = "Certificate preview",
  className
}) {
  const trimmedUrl = url.trim();
  const [show, setShow] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const canvasRef = useRef(null);
  if (!trimmedUrl) return null;
  const pathname = getPathnameLower(trimmedUrl);
  const image = isImageUrl(pathname);
  const pdf = isPdfUrl(pathname);
  useEffect(() => {
    if (!show || !pdf) return;
    let cancelled = false;
    const renderPdf = async () => {
      var _a;
      try {
        setPdfError("");
        const pdfjs = await loadPdfJs();
        const loadingTask = pdfjs.getDocument(trimmedUrl);
        const doc = await loadingTask.promise;
        if (cancelled) return;
        const page = await doc.getPage(1);
        if (cancelled) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;
        const unscaled = page.getViewport({ scale: 1 });
        const targetWidth = Math.max(((_a = canvas.parentElement) == null ? void 0 : _a.clientWidth) || 800, 320);
        const scale = Math.min(2.2, Math.max(0.7, targetWidth / unscaled.width));
        const viewport = page.getViewport({ scale });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport }).promise;
      } catch {
        if (!cancelled) setPdfError("Failed to preview PDF.");
      }
    };
    renderPdf();
    return () => {
      cancelled = true;
    };
  }, [show, pdf, trimmedUrl]);
  return /* @__PURE__ */ jsxs("div", { className: ["mt-2", className].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setShow((v) => !v),
        className: "inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700",
        children: show ? "Hide certificate" : "View certificate"
      }
    ),
    show && /* @__PURE__ */ jsx("div", { className: "mt-2 overflow-hidden rounded-md border border-surface-200 bg-white", children: image ? /* @__PURE__ */ jsx("img", { src: trimmedUrl, alt: title, loading: "lazy", className: "max-h-72 w-full object-contain bg-surface-50" }) : pdf ? /* @__PURE__ */ jsxs("div", { className: "overflow-auto", children: [
      /* @__PURE__ */ jsx("canvas", { ref: canvasRef, className: "block max-w-full" }),
      pdfError && /* @__PURE__ */ jsxs("div", { className: "p-3 text-xs text-rose-600", children: [
        pdfError,
        " ",
        /* @__PURE__ */ jsx("a", { href: trimmedUrl, target: "_blank", rel: "noreferrer", className: "underline", children: "Open file" })
      ] })
    ] }) : /* @__PURE__ */ jsx("iframe", { src: `${trimmedUrl}#toolbar=0`, title, loading: "lazy", className: "h-72 w-full" }) })
  ] });
}
const meta$5 = () => [{ title: "Applicants – CareerNest" }];
const STAGE_CONFIG = {
  applied: { label: "Applied", badge: "bg-blue-50 text-blue-700" },
  under_review: { label: "Under Review", badge: "bg-yellow-50 text-yellow-700" },
  shortlisted: { label: "Shortlisted", badge: "bg-purple-50 text-purple-700" },
  interview_scheduled: { label: "Interview Scheduled", badge: "bg-indigo-50 text-indigo-700" },
  selected: { label: "Selected", badge: "bg-emerald-50 text-emerald-700" },
  rejected: { label: "Rejected", badge: "bg-rose-50 text-rose-700" }
};
const ALL_STAGES = Object.keys(STAGE_CONFIG);
const STAGE_TRANSITIONS = {
  applied: ["under_review", "rejected"],
  under_review: ["shortlisted", "rejected"],
  shortlisted: ["interview_scheduled", "rejected"],
  interview_scheduled: ["selected", "rejected"],
  selected: [],
  rejected: []
};
const IST_TIME_ZONE$1 = "Asia/Kolkata";
function parseDateTimeLocalAsISTToISO(value) {
  const normalized = value == null ? void 0 : value.trim();
  if (!normalized) throw new Error("scheduledAt is required");
  const withOffset = normalized.length === 16 ? `${normalized}:00+05:30` : `${normalized}+05:30`;
  const parsed = new Date(withOffset);
  if (Number.isNaN(parsed.getTime())) throw new Error("Invalid scheduledAt value");
  return parsed.toISOString();
}
function toDateTimeLocalInIST(date = /* @__PURE__ */ new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: IST_TIME_ZONE$1,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);
  const get = (type) => {
    var _a;
    return ((_a = parts.find((p) => p.type === type)) == null ? void 0 : _a.value) || "00";
  };
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}
function sl(s) {
  var _a;
  return ((_a = STAGE_CONFIG[s]) == null ? void 0 : _a.label) || s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function initials(name) {
  return (name || "?").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function formatAcademicYear(y) {
  const n = Number(y);
  if (!Number.isFinite(n) || n <= 0) return "—";
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}
function val(v) {
  if (v === null || v === void 0 || v === "") return "—";
  if (Array.isArray(v)) return v.length ? v.join(", ") : "—";
  return String(v);
}
function CertificatePreviewToggle({ url, title }) {
  if (!url) return /* @__PURE__ */ jsxs("p", { children: [
    /* @__PURE__ */ jsx("span", { className: "text-surface-400", children: "Certificate URL:" }),
    " ",
    /* @__PURE__ */ jsx("span", { className: "text-surface-700", children: "—" })
  ] });
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("p", { children: [
      /* @__PURE__ */ jsx("span", { className: "text-surface-400", children: "Certificate URL:" }),
      " ",
      /* @__PURE__ */ jsx("span", { className: "text-surface-700 break-all", children: url })
    ] }),
    /* @__PURE__ */ jsx(InlineCertificateViewer, { url, title, className: "mt-1" })
  ] });
}
async function loader$b({ request: request2 }) {
  const { token, user, company } = await requireCompanyContext(request2);
  const url = new URL(request2.url);
  const driveId = url.searchParams.get("driveId") || "";
  const stage = url.searchParams.get("stage") || "";
  const drives = await loadCompanyDrives(token, user, company);
  let allApplications = [];
  let drive = null;
  if (driveId) {
    try {
      const dr = await api.drives.getById(token, driveId);
      drive = dr.data || dr;
    } catch {
    }
    try {
      const res = await api.applications.list(token, `driveId=${driveId}&limit=500`);
      allApplications = res.data || [];
    } catch {
    }
  } else {
    const all = await Promise.all(drives.map(async (d) => {
      try {
        const res = await api.applications.list(token, `driveId=${d.id}&limit=500`);
        return (res.data || []).map((a) => ({ ...a, driveTitle: a.driveTitle || d.title }));
      } catch {
        return [];
      }
    }));
    allApplications = all.flat();
  }
  const stageCounts = {};
  ALL_STAGES.forEach((s) => {
    stageCounts[s] = 0;
  });
  allApplications.forEach((a) => {
    if (stageCounts[a.stage] !== void 0) stageCounts[a.stage]++;
  });
  const applications = stage ? allApplications.filter((a) => a.stage === stage) : allApplications;
  return json({ drives, applications, drive, driveId, stage, stageCounts, totalApplicants: allApplications.length });
}
async function action$4({ request: request2 }) {
  var _a;
  const { token, company } = await requireCompanyContext(request2);
  const form = await request2.formData();
  const intent = String(form.get("intent") || "fetchDetails");
  if (intent === "updateStage") {
    const appId2 = String(form.get("appId") || "");
    const newStage = String(form.get("stage") || "");
    if (!appId2 || !newStage) return json({ error: "Missing fields" }, { status: 400 });
    try {
      await api.applications.updateStage(token, appId2, newStage);
      return json({ ok: true, appId: appId2, stage: newStage });
    } catch {
      return json({ error: "Failed to update stage" }, { status: 500 });
    }
  }
  if (intent === "scheduleInterview") {
    const appId2 = String(form.get("appId") || "");
    const mode2 = String(form.get("mode") || "careernest");
    const scheduledAt = String(form.get("scheduledAt") || "");
    const durationMinutes = Number(form.get("durationMinutes") || 60);
    const interviewerName = String(form.get("interviewerName") || "");
    const interviewerEmail = String(form.get("interviewerEmail") || "");
    const notes = String(form.get("notes") || "");
    const externalLink = String(form.get("externalLink") || "");
    if (!appId2 || !scheduledAt) return json({ error: "Missing required fields" }, { status: 400 });
    if (mode2 === "external" && !externalLink) return json({ error: "External meeting link is required" }, { status: 400 });
    try {
      const payload = {
        applicationId: appId2,
        scheduledAt: parseDateTimeLocalAsISTToISO(scheduledAt),
        durationMinutes,
        interviewerName,
        interviewerEmail,
        notes
      };
      if (mode2 === "careernest") {
        payload.interviewType = "careernest";
      } else {
        payload.interviewType = "external";
        payload.format = "video_call";
        payload.meetingLink = externalLink;
      }
      await api.interviews.create(token, payload);
      return json({ ok: true });
    } catch (err) {
      return json({ error: (err == null ? void 0 : err.message) || "Failed to schedule interview" }, { status: 500 });
    }
  }
  const appId = String(form.get("appId") || "");
  let application = null;
  let student = null;
  let driveName = "—";
  let collegeName = "—";
  try {
    const res = await api.applications.getById(token, appId);
    application = res.data || res;
  } catch {
    return json({ error: "Application not found" }, { status: 404 });
  }
  if (application == null ? void 0 : application.driveId) {
    try {
      const dr = await api.drives.getById(token, application.driveId);
      const drive = dr.data || dr;
      driveName = (drive == null ? void 0 : drive.title) || "—";
      if (!collegeName || collegeName === "—") {
        const colleges = drive == null ? void 0 : drive.colleges;
        collegeName = Array.isArray(colleges) ? ((_a = colleges[0]) == null ? void 0 : _a.name) || collegeName : (colleges == null ? void 0 : colleges.name) || collegeName;
      }
    } catch {
    }
  }
  if ((!collegeName || collegeName === "—") && (application == null ? void 0 : application.tenantId)) {
    try {
      const tr = await api.tenants.getById(token, application.tenantId);
      const tenant = tr.data || tr;
      collegeName = (tenant == null ? void 0 : tenant.name) || collegeName;
    } catch {
    }
  }
  collegeName = company.collegeName || "—";
  return json({ application, student, driveName, collegeName });
}
function InterviewSchedulerModal({
  app,
  onClose,
  onScheduled
}) {
  var _a;
  const fetcher = useFetcher();
  const [mode2, setMode] = useState("careernest");
  useEffect(() => {
    var _a2;
    if ((_a2 = fetcher.data) == null ? void 0 : _a2.ok) {
      onScheduled();
      onClose();
    }
  }, [fetcher.data]);
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40 backdrop-blur-sm", onClick: onClose }),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-surface-100", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-surface-900", children: "Schedule Interview" }),
        /* @__PURE__ */ jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-700", children: /* @__PURE__ */ jsx(X, { size: 16 }) })
      ] }),
      /* @__PURE__ */ jsxs(fetcher.Form, { method: "post", className: "p-5 space-y-3", children: [
        /* @__PURE__ */ jsx("input", { type: "hidden", name: "intent", value: "scheduleInterview" }),
        /* @__PURE__ */ jsx("input", { type: "hidden", name: "appId", value: app.$id || app.id }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-surface-600 rounded-lg bg-surface-50 p-2.5", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium text-surface-800", children: app.studentName || "Candidate" }),
          /* @__PURE__ */ jsx("p", { className: "text-surface-500", children: app.studentEmail || "—" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-surface-700 mb-1", children: "Interview Type" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              name: "mode",
              value: mode2,
              onChange: (e) => setMode(e.target.value),
              className: "w-full px-3 py-2 border border-surface-200 rounded-lg text-sm",
              children: [
                /* @__PURE__ */ jsx("option", { value: "careernest", children: "Schedule on CareerNest platform" }),
                /* @__PURE__ */ jsx("option", { value: "external", children: "Google Meet / Zoom / Other" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-surface-700 mb-1", children: "Date & Time (IST)" }),
          /* @__PURE__ */ jsx("input", { name: "scheduledAt", type: "datetime-local", required: true, min: toDateTimeLocalInIST(), className: "w-full px-3 py-2 border border-surface-200 rounded-lg text-sm" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-surface-700 mb-1", children: "Duration" }),
          /* @__PURE__ */ jsxs("select", { name: "durationMinutes", defaultValue: "60", className: "w-full px-3 py-2 border border-surface-200 rounded-lg text-sm", children: [
            /* @__PURE__ */ jsx("option", { value: "30", children: "30 minutes" }),
            /* @__PURE__ */ jsx("option", { value: "45", children: "45 minutes" }),
            /* @__PURE__ */ jsx("option", { value: "60", children: "60 minutes" }),
            /* @__PURE__ */ jsx("option", { value: "90", children: "90 minutes" })
          ] })
        ] }),
        mode2 === "external" && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-surface-700 mb-1", children: "Meeting Link" }),
          /* @__PURE__ */ jsx("input", { name: "externalLink", type: "url", required: true, placeholder: "https://meet.google.com/... or https://zoom.us/...", className: "w-full px-3 py-2 border border-surface-200 rounded-lg text-sm" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsx("input", { name: "interviewerName", type: "text", placeholder: "Interviewer name", className: "w-full px-3 py-2 border border-surface-200 rounded-lg text-sm" }),
          /* @__PURE__ */ jsx("input", { name: "interviewerEmail", type: "email", placeholder: "Interviewer email", className: "w-full px-3 py-2 border border-surface-200 rounded-lg text-sm" })
        ] }),
        /* @__PURE__ */ jsx("textarea", { name: "notes", rows: 2, placeholder: "Notes for candidate (optional)", className: "w-full px-3 py-2 border border-surface-200 rounded-lg text-sm resize-none" }),
        ((_a = fetcher.data) == null ? void 0 : _a.error) && /* @__PURE__ */ jsx("p", { className: "text-xs text-rose-600", children: fetcher.data.error }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-1", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, className: "flex-1 px-3 py-2 border border-surface-200 rounded-lg text-sm font-medium text-surface-700", children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { type: "submit", className: "flex-1 px-3 py-2 bg-primary-600 rounded-lg text-sm font-medium text-white hover:bg-primary-700", children: "Schedule Interview" })
        ] })
      ] })
    ] })
  ] });
}
function ApplicantModal({ app, onClose }) {
  var _a, _b, _c, _d, _e;
  const fetcher = useFetcher();
  useEffect(() => {
    const appId = app.$id || app.id;
    fetcher.submit({ intent: "fetchDetails", appId }, { method: "post" });
  }, []);
  const application = ((_a = fetcher.data) == null ? void 0 : _a.application) ?? app;
  const student = (_b = fetcher.data) == null ? void 0 : _b.student;
  const loading = fetcher.state !== "idle";
  const name = (student == null ? void 0 : student.name) || app.studentName || "Student";
  const parsedSkills = Array.isArray(application == null ? void 0 : application.skills) ? application.skills : typeof (application == null ? void 0 : application.skills) === "string" ? application.skills.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const projects = Array.isArray(application == null ? void 0 : application.projects) ? application.projects : [];
  const achievements = Array.isArray(application == null ? void 0 : application.achievements) ? application.achievements : [];
  const experiences = Array.isArray(application == null ? void 0 : application.experiences) ? application.experiences : [];
  const driveName = ((_c = fetcher.data) == null ? void 0 : _c.driveName) || (app == null ? void 0 : app.driveTitle) || "—";
  const collegeName = ((_d = fetcher.data) == null ? void 0 : _d.collegeName) || (student == null ? void 0 : student.collegeName) || (student == null ? void 0 : student.college) || "—";
  const departmentName = (student == null ? void 0 : student.departmentName) || (student == null ? void 0 : student.department) || (app == null ? void 0 : app.studentDepartment) || (application == null ? void 0 : application.branch) || (app == null ? void 0 : app.branch) || "—";
  const basicFields = [
    ["College Name", collegeName],
    ["Drive Name", driveName],
    ["Student ID", application == null ? void 0 : application.studentId],
    ["Department", departmentName],
    ["Stage", sl((application == null ? void 0 : application.stage) || "applied")],
    ["Applied At", fmtDate((application == null ? void 0 : application.appliedAt) || (application == null ? void 0 : application.$createdAt) || (application == null ? void 0 : application.createdAt))],
    ["Updated At", fmtDate((application == null ? void 0 : application.$updatedAt) || (application == null ? void 0 : application.updatedAt))],
    ["Phone Number", application == null ? void 0 : application.phoneNumber],
    ["Current City", application == null ? void 0 : application.currentCity],
    ["Degree", application == null ? void 0 : application.degree],
    ["Branch", application == null ? void 0 : application.branch],
    ["Academic Year", formatAcademicYear(application == null ? void 0 : application.academicYear)],
    ["Graduation Year", application == null ? void 0 : application.graduationYear],
    ["CGPA", application == null ? void 0 : application.cgpa],
    ["Has Backlogs", (application == null ? void 0 : application.hasBacklogs) === true ? "Yes" : (application == null ? void 0 : application.hasBacklogs) === false ? "No" : "—"],
    ["Backlog Count", application == null ? void 0 : application.backlogCount],
    ["Skills", parsedSkills],
    ["Resume URL", application == null ? void 0 : application.resumeFileId],
    ["Agreed To Terms", (application == null ? void 0 : application.agreedToTerms) === true ? "Yes" : (application == null ? void 0 : application.agreedToTerms) === false ? "No" : "—"],
    ["Cover Letter", application == null ? void 0 : application.coverLetter]
  ];
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40 backdrop-blur-sm", onClick: onClose }),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-surface-100", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-surface-900", children: "Application Details" }),
        /* @__PURE__ */ jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-700 transition-colors", children: /* @__PURE__ */ jsx(X, { size: 16 }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-5 max-h-[80vh] overflow-y-auto space-y-4", children: loading ? /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-surface-100 animate-pulse shrink-0" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2 pt-1", children: [
            /* @__PURE__ */ jsx("div", { className: "h-4 bg-surface-100 rounded animate-pulse w-3/4" }),
            /* @__PURE__ */ jsx("div", { className: "h-3 bg-surface-100 rounded animate-pulse w-1/2" })
          ] })
        ] }),
        [80, 65, 50].map((w) => /* @__PURE__ */ jsx("div", { className: "h-3.5 bg-surface-100 rounded animate-pulse", style: { width: `${w}%` } }, w))
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-surface-200 overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "h-14 bg-gradient-to-br from-primary-100 to-indigo-100" }),
          /* @__PURE__ */ jsxs("div", { className: "px-4 pb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "-mt-6 flex items-end gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "h-12 w-12 flex items-center justify-center rounded-full border-2 border-white bg-primary-600 text-white text-sm font-bold shadow shrink-0", children: initials(name) }),
              /* @__PURE__ */ jsxs("div", { className: "pb-1 flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "font-bold text-surface-900 truncate", children: name }),
                (student == null ? void 0 : student.headline) && /* @__PURE__ */ jsx("p", { className: "text-xs text-surface-500 truncate", children: student.headline })
              ] }),
              /* @__PURE__ */ jsx("span", { className: `shrink-0 mb-1 text-xs font-medium px-2.5 py-1 rounded-full ${((_e = STAGE_CONFIG[application == null ? void 0 : application.stage]) == null ? void 0 : _e.badge) || "bg-surface-100 text-surface-600"}`, children: sl((application == null ? void 0 : application.stage) || "applied") })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-1.5 text-xs text-surface-600", children: [
              ((student == null ? void 0 : student.email) || app.studentEmail) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Mail, { size: 12, className: "text-surface-400 shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: (student == null ? void 0 : student.email) || app.studentEmail })
              ] }),
              ((student == null ? void 0 : student.phone) || (student == null ? void 0 : student.phoneNumber)) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Phone, { size: 12, className: "text-surface-400 shrink-0" }),
                student.phone || student.phoneNumber
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1 mt-1", children: [
                departmentName !== "—" && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(GraduationCap, { size: 11, className: "text-surface-400" }),
                  departmentName
                ] }),
                (student == null ? void 0 : student.cgpa) != null && /* @__PURE__ */ jsxs("span", { className: "font-medium text-surface-700", children: [
                  "CGPA ",
                  student.cgpa
                ] }),
                ((student == null ? void 0 : student.studentId) || (application == null ? void 0 : application.studentId)) && /* @__PURE__ */ jsxs("span", { className: "text-surface-400", children: [
                  "ID: ",
                  (student == null ? void 0 : student.studentId) || (application == null ? void 0 : application.studentId)
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-surface-200 p-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-2", children: "All Application Fields" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs", children: basicFields.map(([label, value]) => /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsxs("span", { className: "text-surface-400", children: [
              label,
              ":"
            ] }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-surface-700 whitespace-pre-wrap", children: val(value) })
          ] }, label)) }),
          (application == null ? void 0 : application.resumeFileId) && application.resumeFileId !== "—" && /* @__PURE__ */ jsxs(
            "a",
            {
              href: application.resumeFileId,
              target: "_blank",
              rel: "noreferrer",
              className: "mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700",
              children: [
                "View Resume ",
                /* @__PURE__ */ jsx(ArrowUpRight, { size: 12 })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-2", children: "Projects" }),
          projects.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs text-surface-500", children: "—" }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: projects.map((p, i) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-surface-200 p-2.5 text-xs", children: [
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-surface-400", children: "Title:" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-surface-800", children: val(p.title) })
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-surface-400", children: "Description:" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-surface-700", children: val(p.description) })
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-surface-400", children: "Technologies:" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-surface-700", children: val(p.technologies) })
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-surface-400", children: "Project Link:" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-surface-700", children: val(p.projectLink) })
            ] }),
            /* @__PURE__ */ jsx(CertificatePreviewToggle, { url: p.certificateUrl, title: `${p.title || "Project"} certificate` })
          ] }, p.$id || i)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-2", children: "Achievements" }),
          achievements.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs text-surface-500", children: "—" }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: achievements.map((a, i) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-surface-200 p-2.5 text-xs", children: [
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-surface-400", children: "Title:" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-surface-800", children: val(a.title) })
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-surface-400", children: "Description:" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-surface-700", children: val(a.description) })
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-surface-400", children: "Date:" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-surface-700", children: a.date ? fmtDate(a.date) : "—" })
            ] }),
            /* @__PURE__ */ jsx(CertificatePreviewToggle, { url: a.certificateUrl, title: `${a.title || "Achievement"} certificate` })
          ] }, a.$id || i)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-2", children: "Experience" }),
          experiences.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs text-surface-500", children: "—" }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: experiences.map((e, i) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-surface-200 p-2.5 text-xs", children: [
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-surface-400", children: "Company:" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-surface-800", children: val(e.companyName) })
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-surface-400", children: "Role:" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-surface-700", children: val(e.role) })
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-surface-400", children: "Description:" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-surface-700", children: val(e.description) })
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-surface-400", children: "Start Date:" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-surface-700", children: e.startDate ? fmtDate(e.startDate) : "—" })
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-surface-400", children: "End Date:" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-surface-700", children: e.endDate ? fmtDate(e.endDate) : "—" })
            ] }),
            /* @__PURE__ */ jsx(CertificatePreviewToggle, { url: e.certificateUrl, title: `${e.role || "Experience"} certificate` })
          ] }, e.$id || i)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-surface-50 p-3 space-y-1.5 text-sm text-surface-600", children: [
          driveName !== "—" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Briefcase, { size: 13, className: "text-surface-400 shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "truncate", children: driveName })
          ] }),
          collegeName !== "—" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(GraduationCap, { size: 13, className: "text-surface-400 shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "truncate", children: collegeName })
          ] }),
          ((application == null ? void 0 : application.$createdAt) || (application == null ? void 0 : application.createdAt)) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Calendar, { size: 13, className: "text-surface-400 shrink-0" }),
            "Applied ",
            fmtDate(application.$createdAt || application.createdAt)
          ] })
        ] }),
        ((application == null ? void 0 : application.driveId) || app.driveId) && /* @__PURE__ */ jsx(
          Link,
          {
            to: `/drives/${(application == null ? void 0 : application.driveId) || app.driveId}`,
            onClick: onClose,
            className: "block w-full text-center rounded-lg border border-surface-200 px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors",
            children: "View Drive"
          }
        )
      ] }) })
    ] })
  ] });
}
function StageActions({ app, onUpdated, onScheduleInterview }) {
  var _a, _b;
  const fetcher = useFetcher();
  const appId = app.$id || app.id;
  const currentStage = ((_a = fetcher.formData) == null ? void 0 : _a.get("stage")) || app.stage || "applied";
  const updating = fetcher.state !== "idle";
  const options = STAGE_TRANSITIONS[currentStage] || [];
  useEffect(() => {
    var _a2;
    if ((_a2 = fetcher.data) == null ? void 0 : _a2.ok) onUpdated();
  }, [fetcher.data]);
  if (options.length === 0) {
    return /* @__PURE__ */ jsx("span", { className: "inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-surface-100 text-surface-700", children: "Final Stage" });
  }
  return /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2", children: [
    /* @__PURE__ */ jsx("span", { className: `inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${((_b = STAGE_CONFIG[currentStage]) == null ? void 0 : _b.badge) || "bg-surface-100 text-surface-600"}`, children: sl(currentStage) }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxs(
        "select",
        {
          defaultValue: "",
          disabled: updating,
          onChange: (e) => {
            const nextStage = e.target.value;
            if (!nextStage) return;
            if (nextStage === "interview_scheduled") {
              onScheduleInterview(app);
              e.currentTarget.value = "";
              return;
            }
            fetcher.submit(
              { intent: "updateStage", appId, stage: nextStage },
              { method: "post" }
            );
            e.currentTarget.value = "";
          },
          className: `appearance-none pl-2.5 pr-7 py-1.5 border border-surface-200 rounded-md text-xs bg-white text-surface-700 focus:outline-none focus:ring-1 focus:ring-primary-300 ${updating ? "opacity-60" : ""}`,
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Update Stage" }),
            options.map((nextStage) => /* @__PURE__ */ jsx("option", { value: nextStage, children: nextStage === "interview_scheduled" ? "Interview Schedule" : sl(nextStage) }, nextStage))
          ]
        }
      ),
      /* @__PURE__ */ jsx(ChevronDown, { size: 12, className: "pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-surface-400" })
    ] })
  ] });
}
function CompanyApplicants() {
  const { drives, applications, drive, driveId, stage, stageCounts, totalApplicants } = useLoaderData();
  const [selectedApp, setSelectedApp] = useState(null);
  const [scheduleApp, setScheduleApp] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const filtered = applications.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (a.studentName || "").toLowerCase().includes(q) || (a.studentEmail || "").toLowerCase().includes(q) || (a.studentId || "").toLowerCase().includes(q);
  });
  const total = totalApplicants;
  const sel = stageCounts["selected"] || 0;
  const short = stageCounts["shortlisted"] || 0;
  const rej = stageCounts["rejected"] || 0;
  function buildUrl(params) {
    const p = new URLSearchParams();
    if (driveId) p.set("driveId", driveId);
    if (stage) p.set("stage", stage);
    Object.entries(params).forEach(([k, v]) => {
      if (v) p.set(k, v);
      else p.delete(k);
    });
    return `?${p.toString()}`;
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5 animate-fade-in", children: [
    selectedApp && /* @__PURE__ */ jsx(ApplicantModal, { app: selectedApp, onClose: () => setSelectedApp(null) }),
    scheduleApp && /* @__PURE__ */ jsx(
      InterviewSchedulerModal,
      {
        app: scheduleApp,
        onClose: () => setScheduleApp(null),
        onScheduled: () => revalidator.revalidate()
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-surface-900", children: drive ? drive.title : "All Applicants" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-surface-500 mt-0.5", children: [
          total,
          " applicant",
          total !== 1 ? "s" : "",
          stage ? ` · ${sl(stage)}` : "",
          search ? ` · ${filtered.length} shown` : ""
        ] })
      ] }),
      driveId && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
        /* @__PURE__ */ jsx(Link, { to: "/applicants", className: "text-sm text-surface-500 hover:text-surface-700", children: "← All" }),
        /* @__PURE__ */ jsxs(Link, { to: `/drives/${driveId}`, className: "inline-flex items-center gap-1.5 rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-sm font-medium text-surface-700 hover:bg-surface-50", children: [
          "View Drive ",
          /* @__PURE__ */ jsx(ArrowUpRight, { size: 13 })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
      { label: "Total", value: total, icon: /* @__PURE__ */ jsx(Users, { size: 16 }), color: "text-surface-600" },
      { label: "Shortlisted", value: short, icon: /* @__PURE__ */ jsx(GraduationCap, { size: 16 }), color: "text-purple-600" },
      { label: "Selected", value: sel, icon: /* @__PURE__ */ jsx(CheckCircle2, { size: 16 }), color: "text-emerald-600" },
      { label: "Rejected", value: rej, icon: /* @__PURE__ */ jsx(XCircle, { size: 16 }), color: "text-rose-600" }
    ].map((stat) => /* @__PURE__ */ jsxs(Card, { className: "border border-surface-200 !p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 ${stat.color} mb-1`, children: [
        stat.icon,
        /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-surface-500", children: stat.label })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-surface-900", children: stat.value })
    ] }, stat.label)) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: driveId,
            onChange: (e) => {
              const p = new URLSearchParams();
              if (e.target.value) p.set("driveId", e.target.value);
              if (stage) p.set("stage", stage);
              navigate(`?${p.toString()}`);
            },
            className: "appearance-none pl-3 pr-8 py-2 border border-surface-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 text-surface-700",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Drives" }),
              drives.map((d) => /* @__PURE__ */ jsx("option", { value: d.id, children: d.title || "Untitled" }, d.id))
            ]
          }
        ),
        /* @__PURE__ */ jsx(ChevronDown, { size: 14, className: "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-400" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 border border-surface-200 rounded-lg p-0.5 bg-white overflow-x-auto", children: [
        /* @__PURE__ */ jsxs("a", { href: buildUrl({ stage: "" }), className: `px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${!stage ? "bg-surface-100 text-surface-900" : "text-surface-500 hover:text-surface-700"}`, children: [
          "All (",
          total,
          ")"
        ] }),
        ALL_STAGES.map((s) => /* @__PURE__ */ jsxs("a", { href: buildUrl({ stage: s }), className: `px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${stage === s ? "bg-surface-100 text-surface-900" : "text-surface-500 hover:text-surface-700"}`, children: [
          STAGE_CONFIG[s].label,
          " (",
          stageCounts[s] || 0,
          ")"
        ] }, s))
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsx(Search, { size: 14, className: "absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Search by name, email or ID...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "w-full pl-9 pr-3 py-2 border border-surface-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400"
          }
        )
      ] })
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsx(Card, { className: "border border-surface-200", children: /* @__PURE__ */ jsx(EmptyState, { icon: /* @__PURE__ */ jsx(Users, { size: 24 }), title: "No applicants found", description: search ? "Try a different search term." : "Applications will appear here once students apply." }) }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3", children: filtered.map((app) => /* @__PURE__ */ jsxs(Card, { className: "border border-surface-200 !p-3 pb-4 min-w-0 min-h-[172px]", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-surface-900 text-sm truncate", children: app.studentName || app.studentId || "Student" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-surface-400 truncate", children: app.studentEmail || "—" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-[11px] text-surface-500 truncate", children: fmtDate(app.$createdAt || app.createdAt) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 grid grid-cols-1 gap-0.5 text-[11px] text-surface-600", children: [
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-surface-400", children: "Year:" }),
            " ",
            formatAcademicYear(app.academicYear)
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-surface-400", children: "CGPA:" }),
            " ",
            val(app.cgpa)
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "truncate", children: [
            /* @__PURE__ */ jsx("span", { className: "text-surface-400", children: "College:" }),
            " ",
            val(app.collegeName || app.college || app.studentCollegeName || app.studentCollege)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 pt-2 border-t border-surface-100 space-y-2", children: [
        /* @__PURE__ */ jsx(StageActions, { app, onUpdated: () => revalidator.revalidate(), onScheduleInterview: (a) => setScheduleApp(a) }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setSelectedApp(app),
            className: "inline-flex items-center gap-1 text-[11px] font-medium text-primary-600 hover:text-primary-700",
            children: [
              "View Form ",
              /* @__PURE__ */ jsx(ArrowUpRight, { size: 10 })
            ]
          }
        )
      ] })
    ] }, app.$id || app.id)) })
  ] });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4,
  default: CompanyApplicants,
  loader: loader$b,
  meta: meta$5
}, Symbol.toStringTag, { value: "Module" }));
async function loader$a({ params }) {
  return redirect(`/view-drives/${params.id}`);
}
function DriveRedirect() {
  return null;
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DriveRedirect,
  loader: loader$a
}, Symbol.toStringTag, { value: "Module" }));
const meta$4 = () => [{ title: "Interviews – Company – CareerNest" }];
const IST_TIME_ZONE = "Asia/Kolkata";
async function loader$9({ request: request2 }) {
  const { token } = await requireCompanyUserSession(request2);
  const interviewsRes = await api.interviews.list(token, "limit=100").catch(() => ({ data: [], total: 0 }));
  const interviews = interviewsRes.data || [];
  const driveIds = [...new Set(interviews.map((i) => i.driveId).filter(Boolean))];
  const driveMap = /* @__PURE__ */ new Map();
  await Promise.all(driveIds.map(async (id) => {
    try {
      const res = await api.drives.getById(token, id);
      driveMap.set(id, res.data || res);
    } catch {
    }
  }));
  const enriched = interviews.map((iv) => {
    const drive = driveMap.get(iv.driveId) || {};
    return { ...iv, driveTitle: drive.title || "Unknown Drive" };
  });
  const upcoming = enriched.filter((i) => i.status === "scheduled" && new Date(i.scheduledAt) > /* @__PURE__ */ new Date()).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  const past = enriched.filter((i) => i.status !== "scheduled" || new Date(i.scheduledAt) <= /* @__PURE__ */ new Date());
  return json({ upcoming, past, total: enriched.length });
}
function CompanyInterviewsPage() {
  const { upcoming, past, total } = useLoaderData();
  const formatDate2 = (iso) => new Date(iso).toLocaleString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: IST_TIME_ZONE
  });
  const StatusBadge = ({ status }) => {
    const colors = {
      scheduled: "bg-blue-50 text-blue-700 border-blue-200",
      ongoing: "bg-green-50 text-green-700 border-green-200",
      completed: "bg-gray-100 text-gray-600 border-gray-200",
      cancelled: "bg-red-50 text-red-600 border-red-200"
    };
    return /* @__PURE__ */ jsx("span", { className: `inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${colors[status] || colors.scheduled}`, children: status.charAt(0).toUpperCase() + status.slice(1) });
  };
  const InterviewRow = ({ iv }) => {
    var _a;
    return /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4 py-4 border-b border-gray-100 last:border-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900 text-sm truncate", children: iv.driveTitle }),
          /* @__PURE__ */ jsx(StatusBadge, { status: iv.status })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 mb-1", children: [
          formatDate2(iv.scheduledAt),
          " · ",
          iv.durationMinutes || 60,
          " min · ",
          (_a = iv.format) == null ? void 0 : _a.replace("_", " ")
        ] }),
        iv.interviewerName && /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400", children: [
          "Interviewer: ",
          iv.interviewerName
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0", children: [
        iv.status === "scheduled" && iv.roomId && /* @__PURE__ */ jsxs(
          "a",
          {
            href: `/interview/${iv.roomId}`,
            target: "_blank",
            rel: "noreferrer",
            className: "inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-xl hover:bg-blue-700 transition-colors",
            children: [
              /* @__PURE__ */ jsx(Video, { className: "w-3.5 h-3.5" }),
              " Join"
            ]
          }
        ),
        iv.result && iv.result !== "pending" && /* @__PURE__ */ jsx("span", { className: `text-xs font-medium px-2 py-1 rounded-lg ${iv.result === "pass" ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"}`, children: iv.result === "pass" ? "✅ Pass" : "❌ Fail" })
      ] })
    ] });
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Interviews" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 mt-1", children: [
        total,
        " total · ",
        upcoming.length,
        " upcoming"
      ] })
    ] }),
    upcoming.length > 0 && /* @__PURE__ */ jsxs(Card, { className: "p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "px-5 py-3 bg-blue-50 border-b border-blue-100", children: /* @__PURE__ */ jsxs("h2", { className: "font-semibold text-blue-800 text-sm flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" }),
        " Upcoming Interviews (",
        upcoming.length,
        ")"
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "px-5", children: upcoming.map((iv) => /* @__PURE__ */ jsx(InterviewRow, { iv }, iv.$id)) })
    ] }),
    past.length > 0 && /* @__PURE__ */ jsxs(Card, { className: "p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "px-5 py-3 bg-gray-50 border-b border-gray-100", children: /* @__PURE__ */ jsx("h2", { className: "font-semibold text-gray-700 text-sm", children: "Past Interviews" }) }),
      /* @__PURE__ */ jsx("div", { className: "px-5", children: past.map((iv) => /* @__PURE__ */ jsx(InterviewRow, { iv }, iv.$id)) })
    ] }),
    total === 0 && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsx(Calendar, { size: 28 }),
        title: "No interviews yet",
        description: "Schedule interviews from the drive candidate management page.",
        action: /* @__PURE__ */ jsx(Link, { to: "/drives", className: "text-sm text-blue-600 hover:text-blue-700 font-medium", children: "Go to Drives →" })
      }
    ) })
  ] });
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CompanyInterviewsPage,
  loader: loader$9,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
function formatSalaryDisplay(salary, period) {
  if (salary <= 0) return "Not disclosed";
  if (period === "monthly") return `Rs ${salary.toLocaleString("en-IN")}/mo`;
  if (salary >= 1e5) return `Rs ${(salary / 1e5).toFixed(1)} LPA`;
  return `Rs ${salary.toLocaleString("en-IN")}`;
}
function formatJobLevelLabel(level) {
  const labels = {
    internship: "Internship",
    entry: "Entry Level",
    junior: "Junior",
    mid: "Mid-level",
    senior: "Senior"
  };
  return labels[level] ?? level;
}
function formatJobTypeLabel(type) {
  const labels = {
    full_time: "Full-time",
    part_time: "Part-time",
    internship: "Internship",
    contract: "Contract",
    freelance: "Freelance"
  };
  return labels[type] ?? type;
}
function getDaysUntil(deadline) {
  const now = /* @__PURE__ */ new Date();
  const end = new Date(deadline);
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1e3 * 60 * 60 * 24));
}
const meta$3 = () => [{ title: "Dashboard - Company Portal - CareerNest" }];
const primaryLinkClass = "inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-700";
async function loader$8({ request: request2 }) {
  const { token, user, company } = await requireCompanyContext(request2);
  const drives = await loadCompanyDrives(token, user, company);
  const summaries = await loadDriveApplicationSummaries(token, drives);
  const drivesWithMetrics = drives.map((drive) => ({
    ...drive,
    summary: summaries[drive.id] || {
      total: 0,
      applied: 0,
      underReview: 0,
      shortlisted: 0,
      interviewScheduled: 0,
      selected: 0,
      rejected: 0
    }
  }));
  const totalApplications = drivesWithMetrics.reduce((sum, drive) => sum + drive.summary.total, 0);
  const selectedCandidates = drivesWithMetrics.reduce((sum, drive) => sum + drive.summary.selected, 0);
  const activeDrives = drivesWithMetrics.filter((drive) => drive.status === "open" && getDaysUntil(drive.deadline) >= 0).length;
  const selectionRate = totalApplications > 0 ? Math.round(selectedCandidates / totalApplications * 1e3) / 10 : 0;
  const topDrives = [...drivesWithMetrics].sort((left, right) => {
    if (right.summary.total !== left.summary.total) {
      return right.summary.total - left.summary.total;
    }
    return right.summary.selected - left.summary.selected;
  }).slice(0, 4);
  const upcomingDeadlines = [...drivesWithMetrics].filter((drive) => drive.deadline && getDaysUntil(drive.deadline) >= 0).sort((left, right) => new Date(left.deadline).getTime() - new Date(right.deadline).getTime()).slice(0, 4);
  return json({
    company,
    stats: {
      totalDrives: drives.length,
      activeDrives,
      totalApplications,
      selectedCandidates,
      selectionRate
    },
    topDrives,
    upcomingDeadlines
  });
}
function CompanyDashboard() {
  const { company, stats, topDrives, upcomingDeadlines } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium uppercase tracking-[0.2em] text-amber-600", children: "Company Portal" }),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-surface-900", children: company.name }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-2xl text-surface-500", children: "Track drive performance, shortlist momentum, and deadlines from one place." })
      ] }),
      /* @__PURE__ */ jsxs(Link, { to: "/drives", className: primaryLinkClass, children: [
        "Manage Drives ",
        /* @__PURE__ */ jsx(ArrowRight, { size: 16 })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4", children: [
      /* @__PURE__ */ jsx(StatCard, { title: "Active Drives", value: stats.activeDrives, subtitle: `${stats.totalDrives} total live records`, icon: /* @__PURE__ */ jsx(Briefcase, { size: 24 }) }),
      /* @__PURE__ */ jsx(StatCard, { title: "Applications", value: stats.totalApplications, subtitle: "Across all company drives", icon: /* @__PURE__ */ jsx(FileText, { size: 24 }) }),
      /* @__PURE__ */ jsx(StatCard, { title: "Selections", value: stats.selectedCandidates, subtitle: "Candidates marked selected", icon: /* @__PURE__ */ jsx(CheckCircle2, { size: 24 }) }),
      /* @__PURE__ */ jsx(StatCard, { title: "Selection Rate", value: `${stats.selectionRate}%`, subtitle: "Selected vs total applicants", icon: /* @__PURE__ */ jsx(TrendingUp, { size: 24 }) })
    ] }),
    topDrives.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr,1fr]", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-5 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-surface-900", children: "Drive Performance" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-surface-500", children: "Most active hiring pipelines right now." })
          ] }),
          /* @__PURE__ */ jsxs(Badge, { variant: "bg-primary-50 text-primary-700", children: [
            topDrives.length,
            " tracked"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: topDrives.map((drive) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-surface-100 bg-surface-50 p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-surface-900", children: drive.title }),
              /* @__PURE__ */ jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-3 text-sm text-surface-500", children: [
                /* @__PURE__ */ jsx("span", { children: formatJobTypeLabel(drive.jobType) }),
                drive.location && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(MapPin, { size: 13 }),
                  " ",
                  drive.location
                ] }),
                /* @__PURE__ */ jsx("span", { children: formatSalaryDisplay(drive.salary, drive.ctcPeriod) })
              ] })
            ] }),
            /* @__PURE__ */ jsx(Badge, { variant: drive.status === "open" ? "bg-emerald-100 text-emerald-700" : "bg-surface-100 text-surface-600", children: drive.status })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-2 gap-3 md:grid-cols-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-white p-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-surface-400", children: "Applicants" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xl font-semibold text-surface-900", children: drive.summary.total })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-white p-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-surface-400", children: "Shortlisted" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xl font-semibold text-surface-900", children: drive.summary.shortlisted + drive.summary.interviewScheduled })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-white p-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-surface-400", children: "Selected" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xl font-semibold text-emerald-600", children: drive.summary.selected })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-white p-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-surface-400", children: "Rejected" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xl font-semibold text-rose-600", children: drive.summary.rejected })
            ] })
          ] })
        ] }, drive.id)) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-surface-900", children: "Upcoming Deadlines" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-surface-500", children: "Stay ahead of closing applications." })
        ] }),
        upcomingDeadlines.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: upcomingDeadlines.map((drive) => {
          const daysLeft = getDaysUntil(drive.deadline);
          return /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-surface-100 p-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-surface-900", children: drive.title }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-surface-500", children: formatDate$2(drive.deadline) })
              ] }),
              /* @__PURE__ */ jsx(Badge, { variant: daysLeft <= 7 ? "bg-amber-100 text-amber-700" : "bg-primary-50 text-primary-700", children: daysLeft === 0 ? "Closes today" : `${daysLeft} days left` })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between text-sm text-surface-500", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                drive.summary.total,
                " applicants"
              ] }),
              /* @__PURE__ */ jsxs("span", { children: [
                drive.summary.selected,
                " selected"
              ] })
            ] })
          ] }, drive.id);
        }) }) : /* @__PURE__ */ jsx(
          EmptyState,
          {
            icon: /* @__PURE__ */ jsx(CalendarClock, { size: 28 }),
            title: "No upcoming deadlines",
            description: "Create a drive to start collecting applications and track timelines here."
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsx(Briefcase, { size: 28 }),
        title: "No drives yet",
        description: "Your dashboard will light up once your team publishes the first hiring drive.",
        action: /* @__PURE__ */ jsx(Link, { to: "/drives", className: primaryLinkClass, children: "Go to Drives" })
      }
    ) })
  ] });
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CompanyDashboard,
  loader: loader$8,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
async function loader$7() {
  return new Response(null, { status: 204 });
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$7
}, Symbol.toStringTag, { value: "Module" }));
const meta$2 = () => [{ title: "Settings - Company Portal - CareerNest" }];
async function loader$6({ request: request2 }) {
  const { token, user, company } = await requireCompanyContext(request2);
  const drives = await loadCompanyDrives(token, user, company);
  const summaries = await loadDriveApplicationSummaries(token, drives);
  const totalApplications = drives.reduce((sum, drive) => {
    var _a;
    return sum + (((_a = summaries[drive.id]) == null ? void 0 : _a.total) || 0);
  }, 0);
  const selectedCandidates = drives.reduce((sum, drive) => {
    var _a;
    return sum + (((_a = summaries[drive.id]) == null ? void 0 : _a.selected) || 0);
  }, 0);
  const activeDrives = drives.filter((drive) => drive.status === "open").length;
  const departments = [...new Set(drives.flatMap((drive) => drive.department))].slice(0, 8);
  const averageSalary = drives.length > 0 ? Math.round(drives.reduce((sum, drive) => sum + drive.salary, 0) / drives.length) : 0;
  return json({
    company,
    stats: {
      activeDrives,
      totalApplications,
      selectedCandidates,
      averageSalary
    },
    departments
  });
}
function CompanySettings() {
  const { company, stats, departments } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium uppercase tracking-[0.2em] text-amber-600", children: "Company Profile" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-surface-900", children: "Settings" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-surface-500", children: "Reference details for your verified organization profile in CareerNest." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4", children: [
      /* @__PURE__ */ jsx(Card, { className: "!p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-blue-50 p-2 text-blue-600", children: /* @__PURE__ */ jsx(Briefcase, { size: 18 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-surface-900", children: stats.activeDrives }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-surface-500", children: "Active Drives" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "!p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-primary-50 p-2 text-primary-600", children: /* @__PURE__ */ jsx(Building2, { size: 18 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-surface-900", children: stats.totalApplications }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-surface-500", children: "Applications Received" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "!p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-emerald-50 p-2 text-emerald-600", children: /* @__PURE__ */ jsx(CheckCircle2, { size: 18 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-surface-900", children: stats.selectedCandidates }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-surface-500", children: "Selections" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "!p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-amber-50 p-2 text-amber-600", children: /* @__PURE__ */ jsx(BadgeCheck, { size: 18 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-surface-900", children: formatSalaryDisplay(stats.averageSalary, "annual") }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-surface-500", children: "Average Published CTC" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr,1fr]", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-5 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-surface-900", children: "Verified Company Details" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-surface-500", children: "This profile is used to identify your drives across the portal." })
          ] }),
          /* @__PURE__ */ jsx(Badge, { variant: company.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-surface-100 text-surface-600", children: company.status })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-surface-100 p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-surface-400", children: "Company Name" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 font-semibold text-surface-900", children: company.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-surface-100 p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-surface-400", children: "Contact Person" }),
            /* @__PURE__ */ jsxs("p", { className: "mt-2 flex items-center gap-2 font-semibold text-surface-900", children: [
              /* @__PURE__ */ jsx(User, { size: 15, className: "text-surface-400" }),
              company.contactPerson || "Not provided"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-surface-100 p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-surface-400", children: "Contact Email" }),
            /* @__PURE__ */ jsxs("p", { className: "mt-2 flex items-center gap-2 font-semibold text-surface-900", children: [
              /* @__PURE__ */ jsx(Mail, { size: 15, className: "text-surface-400" }),
              company.contactEmail || "Not provided"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-surface-100 p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-surface-400", children: "Contact Phone" }),
            /* @__PURE__ */ jsxs("p", { className: "mt-2 flex items-center gap-2 font-semibold text-surface-900", children: [
              /* @__PURE__ */ jsx(Phone, { size: 15, className: "text-surface-400" }),
              company.contactPhone || "Not provided"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-5 rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900", children: "Placement cell administrators own company profile changes. If your contact details need correction, reach out to the college placement team." })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-surface-900", children: "Hiring Snapshot" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-surface-500", children: "Signals pulled from your currently published drives." })
        ] }),
        departments.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "mb-2 text-xs uppercase tracking-wide text-surface-400", children: "Target Departments" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: departments.map((department) => /* @__PURE__ */ jsx(Badge, { variant: "bg-primary-50 text-primary-700", children: department }, department)) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-surface-100 p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-emerald-50 p-2 text-emerald-600", children: /* @__PURE__ */ jsx(ShieldCheck, { size: 18 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-surface-900", children: "Profile visibility" }),
              /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-surface-500", children: [
                "Your account is operating under the ",
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-surface-700", children: company.status }),
                " profile state, so students only see drives tied to this verified company record."
              ] })
            ] })
          ] }) })
        ] }) : /* @__PURE__ */ jsx(
          EmptyState,
          {
            icon: /* @__PURE__ */ jsx(Building2, { size: 28 }),
            title: "No drive settings yet",
            description: "Publish a drive to start building your hiring footprint and eligibility preferences."
          }
        )
      ] })
    ] })
  ] });
}
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CompanySettings,
  loader: loader$6,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const meta$1 = () => [{ title: "Drives - Company Portal - CareerNest" }];
const DEPARTMENTS = ["CSE", "IT", "ECE", "EE", "ME", "CE", "Civil", "BBA", "MBA", "MCA"];
async function loader$5({ request: request2 }) {
  const { token, user, company } = await requireCompanyContext(request2);
  const drives = await loadCompanyDrives(token, user, company);
  const summaries = await loadDriveApplicationSummaries(token, drives);
  const enrichedDrives = drives.map((drive) => ({
    ...drive,
    summary: summaries[drive.id] || {
      total: 0,
      applied: 0,
      underReview: 0,
      shortlisted: 0,
      interviewScheduled: 0,
      selected: 0,
      rejected: 0
    }
  }));
  return json({ company, drives: enrichedDrives });
}
async function action$3({ request: request2 }) {
  const { token, company } = await requireCompanyContext(request2);
  const form = await request2.formData();
  const deadlineInput = String(form.get("deadline") || "");
  const parsedDeadline = deadlineInput ? new Date(deadlineInput) : null;
  if (!parsedDeadline || Number.isNaN(parsedDeadline.getTime())) {
    return json({ error: "Please provide a valid application deadline." }, { status: 400 });
  }
  try {
    const payload = {
      companies: company.id,
      title: String(form.get("title") || ""),
      status: "open",
      jobLevel: String(form.get("jobLevel") || ""),
      jobType: String(form.get("jobType") || ""),
      experience: String(form.get("experience") || ""),
      ctcPeriod: String(form.get("ctcPeriod") || ""),
      location: String(form.get("location") || ""),
      vacancies: Number(form.get("vacancies") || 0),
      description: String(form.get("description") || ""),
      salary: Number(form.get("salary") || 0),
      deadline: parsedDeadline.toISOString(),
      department: form.getAll("department").map((value) => String(value)),
      studyingYear: String(form.get("studyingYear") || ""),
      externalLink: String(form.get("externalLink") || "") || void 0,
      CGPA: Number(form.get("CGPA") || 0),
      Backlogs: Number(form.get("Backlogs") || 0)
    };
    await api.drives.create(token, payload);
    return json({ success: true });
  } catch (error) {
    const err = error;
    return json({ error: err.message || "Failed to create drive." }, { status: 400 });
  }
}
function CompanyDrives() {
  var _a;
  const { company, drives } = useLoaderData();
  const fetcher = useFetcher();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    var _a2;
    if ((_a2 = fetcher.data) == null ? void 0 : _a2.success) {
      setShowModal(false);
    }
  }, [fetcher.data]);
  const filteredDrives = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return drives.filter((drive) => {
      const matchesSearch = !query || [
        drive.title,
        drive.location,
        drive.jobType,
        drive.jobLevel,
        ...drive.department
      ].some((value) => value.toLowerCase().includes(query));
      const matchesStatus = !statusFilter || drive.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [drives, searchQuery, statusFilter]);
  const stats = {
    totalDrives: drives.length,
    activeDrives: drives.filter((drive) => drive.status === "open" && getDaysUntil(drive.deadline) >= 0).length,
    applications: drives.reduce((sum, drive) => sum + drive.summary.total, 0),
    selected: drives.reduce((sum, drive) => sum + drive.summary.selected, 0)
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium uppercase tracking-[0.2em] text-amber-600", children: company.name }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-surface-900", children: "Hiring Drives" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-surface-500", children: "Create and monitor drive pipelines for your campus hiring plan." })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: () => setShowModal(true), children: [
        /* @__PURE__ */ jsx(Plus, { size: 18 }),
        " Create Drive"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4", children: [
      /* @__PURE__ */ jsx(Card, { className: "!p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-blue-50 p-2 text-blue-600", children: /* @__PURE__ */ jsx(Briefcase, { size: 18 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-surface-900", children: stats.totalDrives }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-surface-500", children: "Total Drives" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "!p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-emerald-50 p-2 text-emerald-600", children: /* @__PURE__ */ jsx(Layers3, { size: 18 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-surface-900", children: stats.activeDrives }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-surface-500", children: "Active Pipelines" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "!p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-primary-50 p-2 text-primary-600", children: /* @__PURE__ */ jsx(FileText, { size: 18 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-surface-900", children: stats.applications }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-surface-500", children: "Applications" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { className: "!p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-amber-50 p-2 text-amber-600", children: /* @__PURE__ */ jsx(CheckCircle2, { size: 18 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-surface-900", children: stats.selected }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-surface-500", children: "Selections" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Card, { className: "!p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 lg:flex-row", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsx(Search, { size: 18, className: "absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: searchQuery,
            onChange: (event) => setSearchQuery(event.target.value),
            placeholder: "Search by role, location, department or type...",
            className: "w-full rounded-xl border border-surface-200 bg-surface-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          value: statusFilter,
          onChange: (event) => setStatusFilter(event.target.value),
          className: "form-input w-full lg:w-44",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "All Status" }),
            /* @__PURE__ */ jsx("option", { value: "open", children: "Open" }),
            /* @__PURE__ */ jsx("option", { value: "draft", children: "Draft" }),
            /* @__PURE__ */ jsx("option", { value: "closed", children: "Closed" })
          ]
        }
      )
    ] }) }),
    filteredDrives.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 xl:grid-cols-2", children: filteredDrives.map((drive) => {
      const daysLeft = getDaysUntil(drive.deadline);
      return /* @__PURE__ */ jsxs(Card, { hover: true, className: "!p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-surface-900", children: drive.title }),
              /* @__PURE__ */ jsx(Badge, { variant: drive.status === "open" ? "bg-emerald-100 text-emerald-700" : "bg-surface-100 text-surface-600", children: drive.status })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-3 text-sm text-surface-500", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(IndianRupee, { size: 13 }),
                " ",
                formatSalaryDisplay(drive.salary, drive.ctcPeriod)
              ] }),
              drive.location && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(MapPin, { size: 13 }),
                " ",
                drive.location
              ] }),
              drive.deadline && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Calendar, { size: 13 }),
                " ",
                formatDate$2(drive.deadline)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(Badge, { variant: "bg-primary-50 text-primary-700", children: formatJobTypeLabel(drive.jobType) })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-surface-600", children: drive.description || "No description added yet." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx(Badge, { variant: "bg-surface-100 text-surface-700", children: formatJobLevelLabel(drive.jobLevel) }),
          drive.department.map((department) => /* @__PURE__ */ jsx(Badge, { variant: "bg-indigo-50 text-indigo-700", children: department }, department)),
          drive.studyingYear && /* @__PURE__ */ jsxs(Badge, { variant: "bg-amber-50 text-amber-700", children: [
            drive.studyingYear,
            " year"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-5 grid grid-cols-2 gap-3 md:grid-cols-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-surface-50 p-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-surface-400", children: "Applicants" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xl font-semibold text-surface-900", children: drive.summary.total })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-surface-50 p-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-surface-400", children: "Reviewing" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xl font-semibold text-surface-900", children: drive.summary.underReview })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-surface-50 p-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-surface-400", children: "Shortlisted" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xl font-semibold text-primary-600", children: drive.summary.shortlisted + drive.summary.interviewScheduled })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-surface-50 p-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wide text-surface-400", children: "Selected" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xl font-semibold text-emerald-600", children: drive.summary.selected })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-col gap-3 border-t border-surface-100 pt-4 md:flex-row md:items-center md:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 text-sm text-surface-500", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              drive.vacancies,
              " vacancies"
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              "CGPA ",
              drive.CGPA,
              "+"
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Backlogs up to ",
              drive.Backlogs
            ] }),
            daysLeft >= 0 && /* @__PURE__ */ jsx("span", { children: daysLeft === 0 ? "Closes today" : `${daysLeft} days left` })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            drive.externalLink ? /* @__PURE__ */ jsxs(
              "a",
              {
                href: drive.externalLink,
                target: "_blank",
                rel: "noreferrer",
                className: "inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700",
                children: [
                  "External listing ",
                  /* @__PURE__ */ jsx(ExternalLink, { size: 14 })
                ]
              }
            ) : null,
            /* @__PURE__ */ jsx(
              Link,
              {
                to: `/view-drives/${drive.id}`,
                className: "inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors",
                children: "View Drive"
              }
            )
          ] })
        ] })
      ] }, drive.id);
    }) }) : /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsx(Briefcase, { size: 28 }),
        title: "No drives match these filters",
        description: searchQuery || statusFilter ? "Adjust your filters to see more drives." : "Create your first drive to start collecting applications.",
        action: !searchQuery && !statusFilter ? /* @__PURE__ */ jsx(Button, { onClick: () => setShowModal(true), children: "Create Drive" }) : void 0
      }
    ) }),
    /* @__PURE__ */ jsx(Modal, { isOpen: showModal, onClose: () => setShowModal(false), title: "Create New Drive", size: "lg", children: /* @__PURE__ */ jsxs(fetcher.Form, { method: "post", className: "space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800", children: [
        "This drive will automatically be linked to ",
        /* @__PURE__ */ jsx("span", { className: "font-semibold", children: company.name }),
        "."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsx(Input, { name: "title", label: "Role Title", placeholder: "e.g. Software Engineer", required: true }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "form-label", children: "Job Level" }),
          /* @__PURE__ */ jsxs("select", { name: "jobLevel", className: "form-input", required: true, children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select level" }),
            /* @__PURE__ */ jsx("option", { value: "internship", children: "Internship" }),
            /* @__PURE__ */ jsx("option", { value: "entry", children: "Entry Level" }),
            /* @__PURE__ */ jsx("option", { value: "junior", children: "Junior" }),
            /* @__PURE__ */ jsx("option", { value: "mid", children: "Mid Level" }),
            /* @__PURE__ */ jsx("option", { value: "senior", children: "Senior" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "form-label", children: "Job Type" }),
          /* @__PURE__ */ jsxs("select", { name: "jobType", className: "form-input", required: true, children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select type" }),
            /* @__PURE__ */ jsx("option", { value: "full_time", children: "Full Time" }),
            /* @__PURE__ */ jsx("option", { value: "part_time", children: "Part Time" }),
            /* @__PURE__ */ jsx("option", { value: "internship", children: "Internship" }),
            /* @__PURE__ */ jsx("option", { value: "contract", children: "Contract" }),
            /* @__PURE__ */ jsx("option", { value: "freelance", children: "Freelance" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "form-label", children: "Experience Required" }),
          /* @__PURE__ */ jsxs("select", { name: "experience", className: "form-input", required: true, children: [
            /* @__PURE__ */ jsx("option", { value: "fresher", children: "Fresher" }),
            /* @__PURE__ */ jsx("option", { value: "0-1", children: "0-1 years" }),
            /* @__PURE__ */ jsx("option", { value: "1-2", children: "1-2 years" }),
            /* @__PURE__ */ jsx("option", { value: "2-3", children: "2-3 years" }),
            /* @__PURE__ */ jsx("option", { value: "3-5", children: "3-5 years" }),
            /* @__PURE__ */ jsx("option", { value: "5+", children: "5+ years" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Input, { name: "salary", label: "CTC / Salary", type: "number", min: "0", placeholder: "600000", required: true }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "form-label", children: "Salary Period" }),
          /* @__PURE__ */ jsxs("select", { name: "ctcPeriod", className: "form-input", required: true, children: [
            /* @__PURE__ */ jsx("option", { value: "annual", children: "Annual" }),
            /* @__PURE__ */ jsx("option", { value: "monthly", children: "Monthly" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Input, { name: "location", label: "Location", placeholder: "Bengaluru / Remote", required: true }),
        /* @__PURE__ */ jsx(Input, { name: "vacancies", label: "Vacancies", type: "number", min: "1", placeholder: "10", required: true }),
        /* @__PURE__ */ jsx(Input, { name: "deadline", label: "Application Deadline", type: "date", required: true }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "form-label", children: "Studying Year" }),
          /* @__PURE__ */ jsxs("select", { name: "studyingYear", className: "form-input", required: true, children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select year" }),
            /* @__PURE__ */ jsx("option", { value: "1st", children: "1st" }),
            /* @__PURE__ */ jsx("option", { value: "2nd", children: "2nd" }),
            /* @__PURE__ */ jsx("option", { value: "3rd", children: "3rd" }),
            /* @__PURE__ */ jsx("option", { value: "4th", children: "4th" }),
            /* @__PURE__ */ jsx("option", { value: "graduate", children: "Graduate" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Input, { name: "CGPA", label: "Minimum CGPA", type: "number", min: "0", max: "10", step: "0.1", placeholder: "7.0", required: true }),
        /* @__PURE__ */ jsx(Input, { name: "Backlogs", label: "Maximum Backlogs", type: "number", min: "0", placeholder: "0", required: true })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "form-label", children: "Eligible Departments" }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: DEPARTMENTS.map((department) => /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 rounded-lg border border-surface-200 px-3 py-2 text-sm transition-colors hover:bg-surface-50", children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", name: "department", value: department, className: "rounded border-surface-300 text-primary-600" }),
          department
        ] }, department)) })
      ] }),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          name: "description",
          label: "Drive Description",
          placeholder: "Summarize responsibilities, must-have skills, and how candidates will be evaluated.",
          rows: 4,
          required: true
        }
      ),
      /* @__PURE__ */ jsx(Input, { name: "externalLink", label: "External Application Link", type: "url", placeholder: "https://careers.example.com/apply" }),
      ((_a = fetcher.data) == null ? void 0 : _a.error) ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700", children: fetcher.data.error }) : null,
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 border-t border-surface-100 pt-4", children: [
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", onClick: () => setShowModal(false), children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { type: "submit", disabled: fetcher.state !== "idle", children: fetcher.state !== "idle" ? "Creating..." : "Create Drive" })
      ] })
    ] }) })
  ] });
}
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3,
  default: CompanyDrives,
  loader: loader$5,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
async function loader$4({ request: request2 }) {
  const { user } = await getUserSession(request2);
  if (user) return redirect(withBasePath("/dashboard"));
  return redirect(withBasePath("/login"));
}
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
async function action$2({ request: request2 }) {
  return logout(request2);
}
async function loader$3() {
  return new Response(null, { status: 404 });
}
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const API_URL = process.env.API_URL ?? "http://localhost:4000";
async function proxy(request2, params) {
  const splat = params["*"] ?? "";
  const url = new URL(request2.url);
  const target = `${API_URL}/api/${splat}${url.search}`;
  const proxyHeaders = new Headers(request2.headers);
  proxyHeaders.delete("host");
  proxyHeaders.delete("connection");
  const init = {
    method: request2.method,
    headers: proxyHeaders,
    redirect: "manual"
  };
  if (request2.method !== "GET" && request2.method !== "HEAD") {
    init.body = request2.body;
    init.duplex = "half";
  }
  const upstream = await fetch(target, init);
  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.delete("transfer-encoding");
  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders
  });
}
async function loader$2({ request: request2, params }) {
  return proxy(request2, params);
}
async function action$1({ request: request2, params }) {
  return proxy(request2, params);
}
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const frame3Logo = "/assets/Frame%203-CxNJ4cf9.png";
const meta = () => [{ title: "Login - Company Portal - CareerNest" }];
async function loader$1({ request: request2 }) {
  const { user } = await getUserSession(request2);
  if (user) return redirect(withBasePath("/dashboard"));
  return json({});
}
async function action({ request: request2 }) {
  var _a;
  const formData = await request2.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  if (!email || !password) return json({ error: "Email and password are required" }, { status: 400 });
  try {
    const apiUrl = process.env.API_URL || "http://localhost:4000";
    const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) return json({ error: ((_a = data == null ? void 0 : data.error) == null ? void 0 : _a.message) || "Invalid credentials" }, { status: 401 });
    const user = data.data.user;
    if (user.role !== "company") {
      return json({ error: "Access denied. Only company accounts can access the Company Portal." }, { status: 403 });
    }
    return createUserSession(request2, data.data.token || "session-token", user, "/dashboard");
  } catch {
    return json({ error: "Unable to connect to server." }, { status: 500 });
  }
}
function LoginPage() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-surface-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx("img", { src: frame3Logo, alt: "CareerNest", className: "mx-auto h-40 w-auto mb-2" }),
      /* @__PURE__ */ jsx("p", { className: "text-surface-500 mt-1 text-sm", children: "Company Portal" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-surface-200 bg-white p-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-surface-900 mb-6", children: "Sign in to your account" }),
      (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("div", { className: "mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm", children: actionData.error }),
      /* @__PURE__ */ jsxs(Form, { method: "post", className: "space-y-5", children: [
        /* @__PURE__ */ jsx(Input, { name: "email", type: "email", label: "Email Address", placeholder: "hr@company.com", icon: /* @__PURE__ */ jsx(Mail, { size: 18 }), required: true }),
        /* @__PURE__ */ jsx(Input, { name: "password", type: "password", label: "Password", placeholder: "••••••••", icon: /* @__PURE__ */ jsx(Lock, { size: 18 }), required: true }),
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", size: "lg", isLoading: isSubmitting, children: isSubmitting ? "Signing in..." : "Sign In" })
      ] })
    ] })
  ] }) });
}
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: LoginPage,
  loader: loader$1,
  meta
}, Symbol.toStringTag, { value: "Module" }));
function Header({ userName, userRole, onMenuToggle }) {
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-30 bg-white border-b border-surface-200", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 sm:px-8 py-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("button", { onClick: onMenuToggle, className: "lg:hidden p-2 rounded-lg text-surface-500 hover:bg-surface-50 transition-colors", children: /* @__PURE__ */ jsx(Menu, { size: 20 }) }),
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-surface-500 hidden sm:inline", children: "Company Portal" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 pl-3 border-l border-surface-200", children: [
        /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-white font-semibold text-sm", children: userName.charAt(0).toUpperCase() }),
        /* @__PURE__ */ jsxs("div", { className: "hidden sm:block", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-surface-800", children: userName }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-surface-400 capitalize", children: userRole.replace(/_/g, " ") })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Form, { method: "post", action: "/logout", children: /* @__PURE__ */ jsx("button", { type: "submit", className: "p-2 rounded-lg text-surface-400 hover:text-rose-600 hover:bg-rose-50 transition-colors", title: "Logout", children: /* @__PURE__ */ jsx(LogOut, { size: 20 }) }) })
    ] })
  ] }) });
}
const group2Logo = "/assets/Group%202-CvJT8DTz.png";
function Sidebar({ links: links2, isOpen, onClose }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    isOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/40 z-40 lg:hidden", onClick: onClose }),
    /* @__PURE__ */ jsxs("aside", { className: cn(
      "fixed left-0 top-0 h-screen w-64 bg-surface-900 text-white flex flex-col z-50 transition-transform duration-200",
      isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    ), children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-white/10 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsx("img", { src: group2Logo, alt: "CareerNest", className: "h-8 w-auto" }) }),
        /* @__PURE__ */ jsx("button", { onClick: onClose, className: "lg:hidden p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors", children: /* @__PURE__ */ jsx(X, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "flex-1 p-4 space-y-1 overflow-y-auto", children: links2.map((link) => /* @__PURE__ */ jsxs(NavLink, { to: link.to, onClick: onClose, className: ({ isActive }) => isActive ? "sidebar-link-active" : "sidebar-link", children: [
        link.icon,
        /* @__PURE__ */ jsx("span", { children: link.label })
      ] }, link.to)) }),
      /* @__PURE__ */ jsx("div", { className: "p-4 border-t border-white/10", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-surface-500 text-center", children: "© 2026 CareerNest" }) })
    ] })
  ] });
}
const links = [
  { to: "/dashboard", label: "Dashboard", icon: /* @__PURE__ */ jsx(LayoutDashboard, { size: 20 }) },
  { to: "/drives", label: "My Drives", icon: /* @__PURE__ */ jsx(Briefcase, { size: 20 }) },
  { to: "/interviews", label: "Interviews", icon: /* @__PURE__ */ jsx(Calendar, { size: 20 }) },
  { to: "/settings", label: "Settings", icon: /* @__PURE__ */ jsx(Settings, { size: 20 }) }
];
async function loader({ request: request2 }) {
  const { user } = await requireCompanyUserSession(request2);
  return json({ user });
}
function CompanyLayout() {
  const { user } = useLoaderData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-surface-50", children: [
    /* @__PURE__ */ jsx(Sidebar, { links, isOpen: sidebarOpen, onClose: () => setSidebarOpen(false) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 lg:ml-64", children: [
      /* @__PURE__ */ jsx(Header, { userName: user.name, userRole: user.role, onMenuToggle: () => setSidebarOpen(true) }),
      /* @__PURE__ */ jsx("main", { className: "p-4 sm:p-6 lg:p-8", children: /* @__PURE__ */ jsx(Outlet, {}) })
    ] })
  ] });
}
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CompanyLayout,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BSA6VHJ9.js", "imports": ["/assets/components-DEx6O9G-.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-D8ZwMad6.js", "imports": ["/assets/components-DEx6O9G-.js"], "css": [] }, "routes/_app.drives.$id_.applicants": { "id": "routes/_app.drives.$id_.applicants", "parentId": "routes/_app.drives", "path": ":id/applicants", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_app.drives._id_.applicants-CDj695rK.js", "imports": ["/assets/components-DEx6O9G-.js", "/assets/index-BZPfhc7i.js", "/assets/arrow-left-DdpXVruI.js", "/assets/search-nVRFrwff.js", "/assets/users-DcmEj2bY.js"], "css": [] }, "routes/_app.view-drives.$id": { "id": "routes/_app.view-drives.$id", "parentId": "routes/_app", "path": "view-drives/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_app.view-drives._id-BGg-nmHJ.js", "imports": ["/assets/components-DEx6O9G-.js", "/assets/index-BZPfhc7i.js", "/assets/arrow-left-DdpXVruI.js", "/assets/users-DcmEj2bY.js", "/assets/graduation-cap-BPFUU2My.js", "/assets/briefcase-CpOvsssw.js", "/assets/building-2-pWs0Q8I2.js", "/assets/layers-ClBKCO0g.js", "/assets/calendar-DjSaS34E.js", "/assets/map-pin-BDIyN_Wk.js"], "css": [] }, "routes/_app.applicants.$id": { "id": "routes/_app.applicants.$id", "parentId": "routes/_app.applicants", "path": ":id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_app.applicants._id-DGfJsrQE.js", "imports": ["/assets/components-DEx6O9G-.js", "/assets/index-BZPfhc7i.js", "/assets/arrow-left-DdpXVruI.js", "/assets/user-CobVM7eu.js", "/assets/mail-BoFQsqoK.js", "/assets/phone-CsKM7AuY.js", "/assets/calendar-DjSaS34E.js", "/assets/briefcase-CpOvsssw.js"], "css": [] }, "routes/interview.$roomId": { "id": "routes/interview.$roomId", "parentId": "root", "path": "interview/:roomId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/interview._roomId-BKxCI1o2.js", "imports": ["/assets/components-DEx6O9G-.js"], "css": [] }, "routes/_app.applicants": { "id": "routes/_app.applicants", "parentId": "routes/_app", "path": "applicants", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_app.applicants-bayMO2VC.js", "imports": ["/assets/components-DEx6O9G-.js", "/assets/index-BZPfhc7i.js", "/assets/graduation-cap-BPFUU2My.js", "/assets/users-DcmEj2bY.js", "/assets/circle-check-BHteTAEN.js", "/assets/search-nVRFrwff.js", "/assets/x-CRw8DO8E.js", "/assets/mail-BoFQsqoK.js", "/assets/phone-CsKM7AuY.js", "/assets/briefcase-CpOvsssw.js", "/assets/calendar-DjSaS34E.js"], "css": [] }, "routes/_app.drives.$id": { "id": "routes/_app.drives.$id", "parentId": "routes/_app.drives", "path": ":id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_app.drives._id-ChG-6rmU.js", "imports": [], "css": [] }, "routes/_app.interviews": { "id": "routes/_app.interviews", "parentId": "routes/_app", "path": "interviews", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_app.interviews-BjBIWFvL.js", "imports": ["/assets/components-DEx6O9G-.js", "/assets/index-BZPfhc7i.js", "/assets/calendar-DjSaS34E.js"], "css": [] }, "routes/_app.dashboard": { "id": "routes/_app.dashboard", "parentId": "routes/_app", "path": "dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_app.dashboard-_WzADIJa.js", "imports": ["/assets/components-DEx6O9G-.js", "/assets/index-BZPfhc7i.js", "/assets/company.shared-DPHbXrYT.js", "/assets/briefcase-CpOvsssw.js", "/assets/file-text-CdujQ3d0.js", "/assets/circle-check-BHteTAEN.js", "/assets/map-pin-BDIyN_Wk.js"], "css": [] }, "routes/[favicon.ico]": { "id": "routes/[favicon.ico]", "parentId": "root", "path": "favicon.ico", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_favicon.ico_-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/_app.settings": { "id": "routes/_app.settings", "parentId": "routes/_app", "path": "settings", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_app.settings-B2kCMHdo.js", "imports": ["/assets/components-DEx6O9G-.js", "/assets/index-BZPfhc7i.js", "/assets/company.shared-DPHbXrYT.js", "/assets/briefcase-CpOvsssw.js", "/assets/building-2-pWs0Q8I2.js", "/assets/circle-check-BHteTAEN.js", "/assets/user-CobVM7eu.js", "/assets/mail-BoFQsqoK.js", "/assets/phone-CsKM7AuY.js"], "css": [] }, "routes/_app.drives": { "id": "routes/_app.drives", "parentId": "routes/_app", "path": "drives", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_app.drives-C6fT7Tt7.js", "imports": ["/assets/components-DEx6O9G-.js", "/assets/index-BZPfhc7i.js", "/assets/company.shared-DPHbXrYT.js", "/assets/briefcase-CpOvsssw.js", "/assets/layers-ClBKCO0g.js", "/assets/file-text-CdujQ3d0.js", "/assets/circle-check-BHteTAEN.js", "/assets/search-nVRFrwff.js", "/assets/map-pin-BDIyN_Wk.js", "/assets/calendar-DjSaS34E.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/logout": { "id": "routes/logout", "parentId": "root", "path": "logout", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/logout-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.$": { "id": "routes/api.$", "parentId": "root", "path": "api/*", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api._-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/login-DTp3GBWB.js", "imports": ["/assets/components-DEx6O9G-.js", "/assets/index-BZPfhc7i.js", "/assets/mail-BoFQsqoK.js"], "css": [] }, "routes/_app": { "id": "routes/_app", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_app-CgI3i6sp.js", "imports": ["/assets/components-DEx6O9G-.js", "/assets/index-BZPfhc7i.js", "/assets/x-CRw8DO8E.js", "/assets/briefcase-CpOvsssw.js", "/assets/calendar-DjSaS34E.js"], "css": [] } }, "url": "/assets/manifest-0c6710af.js", "version": "0c6710af" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": false, "v3_relativeSplatPath": false, "v3_throwAbortReason": false, "v3_routeConfig": false, "v3_singleFetch": false, "v3_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/_app.drives.$id_.applicants": {
    id: "routes/_app.drives.$id_.applicants",
    parentId: "routes/_app.drives",
    path: ":id/applicants",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/_app.view-drives.$id": {
    id: "routes/_app.view-drives.$id",
    parentId: "routes/_app",
    path: "view-drives/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/_app.applicants.$id": {
    id: "routes/_app.applicants.$id",
    parentId: "routes/_app.applicants",
    path: ":id",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/interview.$roomId": {
    id: "routes/interview.$roomId",
    parentId: "root",
    path: "interview/:roomId",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/_app.applicants": {
    id: "routes/_app.applicants",
    parentId: "routes/_app",
    path: "applicants",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/_app.drives.$id": {
    id: "routes/_app.drives.$id",
    parentId: "routes/_app.drives",
    path: ":id",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/_app.interviews": {
    id: "routes/_app.interviews",
    parentId: "routes/_app",
    path: "interviews",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/_app.dashboard": {
    id: "routes/_app.dashboard",
    parentId: "routes/_app",
    path: "dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/[favicon.ico]": {
    id: "routes/[favicon.ico]",
    parentId: "root",
    path: "favicon.ico",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/_app.settings": {
    id: "routes/_app.settings",
    parentId: "routes/_app",
    path: "settings",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/_app.drives": {
    id: "routes/_app.drives",
    parentId: "routes/_app",
    path: "drives",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route12
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/api.$": {
    id: "routes/api.$",
    parentId: "root",
    path: "api/*",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/_app": {
    id: "routes/_app",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route16
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
