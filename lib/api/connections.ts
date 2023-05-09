import { ApiInput, ApiResult, getClient, processError } from "./client";

export interface GetConnectionsInput extends ApiInput {
  workspaceId: string;
}

export interface ScheduleApiData {
  scheduleType: "manual" | "cron" | "basic";
  cronExpression?: string;
  basicTiming?: string;
}

export interface ConnectionApiData {
  connectionId: string;
  name: string;
  sourceId: string;
  destinationId: string;
  workspaceId: string;
  status: "active" | "inactive" | "deprecated";
  schedule: ScheduleApiData;
  dataResidency: "auto" | "us" | "eu";
  nonBreakingSchemaUpdatesBehavior?: "ignore" | "disable_connection";
  namespaceDefinition?: "source" | "destination" | "custom_format";
  namespaceFormat?: string;
  prefix?: string;
}

export interface GetConnectionsResult extends ApiResult {
  connections?: ConnectionApiData[];
}

export async function getConnections(
  input: GetConnectionsInput
): Promise<GetConnectionsResult> {
  const client = getClient(input.currentUser);

  try {
    const response: { data: { data: ConnectionApiData[] } } = await client.get(
      "/v1/connections",
      { params: { limit: 1000, workspaceIds: input.workspaceId } }
    );
    return { connections: response.data.data };
  } catch (err: any) {
    return processError(err, "Error getting workspaces");
  }
}
