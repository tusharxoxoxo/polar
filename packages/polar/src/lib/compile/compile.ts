import chalk from "chalk";
import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";

export function compileContract (contractDir: string): void {
  const currDir = process.cwd();
  process.chdir(contractDir);
  console.log(`Compiling contract in directory: ${chalk.gray(contractDir)}`);

  // Compiles the contract and creates .wasm file alongside others
  execSync(`cargo wasm`, { stdio: 'inherit' });

  process.chdir(currDir);
}

export function generateSchema (contractDir: string): void {
  const currDir = process.cwd();
  process.chdir(contractDir);
  console.log(`Creating schema for contract in directory: ${chalk.gray(contractDir)}`);

  // Creates schema .json files
  execSync(`cargo schema`, { stdio: 'inherit' });

  process.chdir(currDir);
}

export function createArtifacts (targetDir: string, schemaDir: string, artifactsDir: string): void {
  const paths = fs.readdirSync(targetDir);

  for (const p of paths) {
    const filename = path.basename(p);
    if (filename.split('.')[filename.split('.').length - 1] !== "wasm") {
      continue;
    }

    console.log(`Copying file ${filename} from ${chalk.gray(targetDir)} to ${chalk.gray(artifactsDir)}`);
    const sourcePath = path.resolve(targetDir, filename);
    const destPath = path.resolve(artifactsDir, filename);
    fs.copyFileSync(sourcePath, destPath);
  }

  const schemaPaths = fs.readdirSync(schemaDir);

  for (const p of schemaPaths) {
    const filename = path.basename(p);
    if (filename.split('.')[filename.split('.').length - 1] !== "json") {
      continue;
    }

    console.log(`Copying file ${filename} from ${chalk.gray(schemaDir)} to ${chalk.gray(artifactsDir)}`);
    const sourcePath = path.resolve(schemaDir, filename);
    const destPath = path.resolve(artifactsDir, filename);
    fs.copyFileSync(sourcePath, destPath);
  }
}