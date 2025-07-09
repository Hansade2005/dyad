import { db } from "../../db";
import { messages } from "../../db/schema";
import { eq } from "drizzle-orm";
import { Message } from "../ipc_types";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";

export const execPromise = promisify(exec);

export async function executeAddDependency({
  packages,
  message,
  appPath,
}: {
  packages: string[];
  message: Message;
  appPath: string;
}) {
  const packageStr = packages.join(" ");
  const packageJsonPath = `${appPath}/package.json`;
  let installResults = "";

  if (fs.existsSync(packageJsonPath)) {
    const { stdout, stderr } = await execPromise(
      `(pnpm add ${packageStr}) || (npm install --legacy-peer-deps ${packageStr})`,
      {
        cwd: appPath,
      },
    );
    installResults = stdout + (stderr ? `\n${stderr}` : "");
  } else {
    installResults =
      "[skipped] No package.json found in this project. Dependency installation is only supported for Node.js projects.";
  }

  // Update the message content with the installation results
  const updatedContent = message.content.replace(
    new RegExp(
      `<dyad-add-dependency packages="${packages.join(
        " ",
      )}">[^<]*</dyad-add-dependency>`,
      "g",
    ),
    `<dyad-add-dependency packages="${packages.join(
      " ",
    )}">${installResults}</dyad-add-dependency>`,
  );

  // Save the updated message back to the database
  await db
    .update(messages)
    .set({ content: updatedContent })
    .where(eq(messages.id, message.id));
}
