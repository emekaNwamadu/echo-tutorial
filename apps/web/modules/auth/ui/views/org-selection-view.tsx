import { OrganizationList, SignIn } from "@clerk/nextjs";

export const OrgSelectionView = () => {
  return (
    <OrganizationList
      afterCreateOrganizationUrl="/"
      afterSelectOrganizationUrl="/"
      hidePersonal
      skipInvitationScreen
    />
  );
};
