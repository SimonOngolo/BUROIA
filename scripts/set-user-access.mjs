import mongoose from "mongoose";

const roles = [
  "CUSTOMER",
  "OPERATIONS_MANAGER",
  "KIOSK_MANAGER",
  "KIOSK_OPERATOR",
  "DOCUMENT_OPERATOR",
  "SUPPORT_AGENT",
  "TECHNICIAN",
  "FINANCE_OPERATOR",
  "SALES_AGENT",
  "CUSTOMER_SUCCESS",
  "COMPLIANCE_OFFICER",
  "SUPER_ADMIN",
];

const [emailArgument, role, requestedTenantId] = process.argv.slice(2);
const email = emailArgument?.trim().toLowerCase();

if (!email || !role || !roles.includes(role)) {
  console.error(`Usage: node --env-file=.env.local scripts/set-user-access.mjs <email> <role> [tenantId]\nRoles: ${roles.join(", ")}`);
  process.exitCode = 1;
} else {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/buroia";
    await mongoose.connect(uri);
    const users = mongoose.connection.collection("users");
    const user = await users.findOne({ email });
    if (!user) {
      console.error(`No BUROIA account found for ${email}. Register the account first.`);
      process.exitCode = 1;
    } else {
      const tenantId = requestedTenantId || user.tenantId || String(user._id);
      await users.updateOne({ _id: user._id }, { $set: { role, tenantId, isActive: true } });
      console.log(`Set ${email} to ${role} for tenant ${tenantId}.`);
    }
  } catch (error) {
    console.error("Could not update the account role:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
