import { defineRelations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";

export const workflowEdges = pgTable("workflow_edges", {
  id: uuid("id").defaultRandom().primaryKey(),

  workflowId: uuid("workflow_id")
    .notNull()
    .references(() => workflowsTable.id, {
      onDelete: "cascade",
    }),

  sourceNodeId: uuid("source_node_id")
    .notNull()
    .references(() => workflowNodes.id, {
      onDelete: "cascade",
    }),

  targetNodeId: uuid("target_node_id")
    .notNull()
    .references(() => workflowNodes.id, {
      onDelete: "cascade",
    }),

  sourceHandle: text("source_handle"),

  targetHandle: text("target_handle"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const workflowNodes = pgTable("workflow_nodes", {
  id: uuid("id").defaultRandom().primaryKey(),

  workflowId: uuid("workflow_id")
    .notNull()
    .references(() => workflowsTable.id, {
      onDelete: "cascade",
    }),

  type: text("type").notNull(),

  label: text("label").notNull(),

  position: jsonb("position")
    .$type<{
      x: number;
      y: number;
    }>()
    .notNull(),

  config: jsonb("config")
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const workflowsTable = pgTable(
  "workflows",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("workflows_user_id_idx").on(table.userId)],
);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const relations = defineRelations(
  {
    user,
    account,
    verification,
    session,
    workflowsTable,
    workflowNodes,
    workflowEdges,
  },
  (r) => ({
    user: {
      sessions: r.many.session({
        from: r.user.id,
        to: r.session.userId,
      }),

      accounts: r.many.account({
        from: r.user.id,
        to: r.account.userId,
      }),

      workflows: r.many.workflowsTable({
        from: r.user.id,
        to: r.workflowsTable.userId,
      }),
    },

    session: {
      user: r.one.user({
        from: r.session.userId,
        to: r.user.id,
        optional: false,
      }),
    },

    account: {
      user: r.one.user({
        from: r.account.userId,
        to: r.user.id,
        optional: false,
      }),
    },

    workflowsTable: {
      user: r.one.user({
        from: r.workflowsTable.userId,
        to: r.user.id,
        optional: false,
      }),

      nodes: r.many.workflowNodes({
        from: r.workflowsTable.id,
        to: r.workflowNodes.workflowId,
      }),

      edges: r.many.workflowEdges({
        from: r.workflowsTable.id,
        to: r.workflowEdges.workflowId,
      }),
    },

    workflowNodes: {
      workflow: r.one.workflowsTable({
        from: r.workflowNodes.workflowId,
        to: r.workflowsTable.id,
        optional: false,
      }),

      outgoingEdges: r.many.workflowEdges({
        from: r.workflowNodes.id,
        to: r.workflowEdges.sourceNodeId,
      }),

      incomingEdges: r.many.workflowEdges({
        from: r.workflowNodes.id,
        to: r.workflowEdges.targetNodeId,
      }),
    },

    workflowEdges: {
      workflow: r.one.workflowsTable({
        from: r.workflowEdges.workflowId,
        to: r.workflowsTable.id,
        optional: false,
      }),

      sourceNode: r.one.workflowNodes({
        from: r.workflowEdges.sourceNodeId,
        to: r.workflowNodes.id,
        optional: false,
      }),

      targetNode: r.one.workflowNodes({
        from: r.workflowEdges.targetNodeId,
        to: r.workflowNodes.id,
        optional: false,
      }),
    },
  }),
);
