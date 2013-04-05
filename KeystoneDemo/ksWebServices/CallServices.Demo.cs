using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ksWebServices
{
    public static partial class CallServices
    {
        private const string _keystoneIP = "127.0.0.1:81";  // this can be either the load balanced IP or instance IP
        private const string _portalIP = "127.0.0.2:83"; // this can be either the load balanced IP or instance IP

        private const int _module_contacts = 96;
        private const int _module_forms = 95;
        private const int _module_messages = 94;


        //LOGIN
        public static async Task<
            Tuple<
                srKeystoneInstanceReadOnlyService.MemberAuthenticationDTO, 
                srKeystoneInstanceReadOnlyService.ListItemDTO,
                srKeystoneInstanceReadOnlyService.LoggedInMemberDTO
            >> 
            AttemptLogin(string userName, string password)
            {
                var r = await LogInGetProjects(_keystoneIP, "InstanceReadOnlyService", userName, password);
                srKeystoneInstanceReadOnlyService.MemberAuthenticationDTO member = r.vProjectMemberAuthenticateUserResult;
                srKeystoneInstanceReadOnlyService.ListItemDTO project1 = member.AvailableProjects.First();

                var s = await GetLoggedInMember(_keystoneIP, "InstanceReadOnlyService", member.MemberId, project1.Id);
                srKeystoneInstanceReadOnlyService.LoggedInMemberDTO loggedInMember = s.vProjectMemberGetLoggedInMemberResult;

                return new Tuple<
                                    srKeystoneInstanceReadOnlyService.MemberAuthenticationDTO,
                                    srKeystoneInstanceReadOnlyService.ListItemDTO,
                                    srKeystoneInstanceReadOnlyService.LoggedInMemberDTO
                                > (member, project1, loggedInMember);
            }



        //USER LIST
        public static async Task<Tuple<srPortalPortalService.CompanyMemberSearchResults>> GetUserList(long memberId, long memberTypeId, long projectId)
        {
            var w = await MemberGetListOfMembersBySearchParameters(_portalIP, "PortalService", memberId, memberTypeId, projectId);
            var userList = w.MemberGetListOfMembersBySearchParametersResult;

            return new Tuple<srPortalPortalService.CompanyMemberSearchResults>(userList);
        }

        //COMPANY LIST
        public static async Task<srPortalPortalService.CompanyDTO1[]> GetCompanyList(long memberId, long memberTypeId, long projectId, string search)
        {
            if (string.IsNullOrEmpty(search))
            {
                var w = await CompanyGetAllDtosRequest(_portalIP, "PortalService", memberId, memberTypeId, projectId);
                var userList = w.CompanyGetAllDtosResult;


                return userList;
            }
            else
            {
                var w = await CompanyGetBySeachText(_portalIP, "PortalService", memberId, memberTypeId, projectId, search);
                var userList = w.CompanyGetBySeachTextResult;


                return userList;

            }

        }

        //ARCHIVE LIST
        public static async Task<srKeystoneInstanceService.ProjectArchiveRequestUiDtos> GetArchiveList(long memberId, long memberTypeId, long projectId)
        {
            var w = await GetArchiveList(_keystoneIP, "InstanceService", memberId, memberTypeId, projectId);
            var archiveItems = w.ArchiveRequestGetProjectArchiveRequestUiDtosResult;

            return archiveItems;

        }

        //LOGBOOK LIST
        public static async Task<srKeystoneInstanceService.DifferenceInfoDTO[]> GetLogBookList(long memberId, long memberTypeId, long projectId)
        {
            var w = await AuditFindChanges(_keystoneIP, "InstanceService", memberId, memberTypeId, projectId);
            var auditItems = w.AuditFindChangesResult;

            return auditItems;

        }

        //CONTACTS BLOCKHEADERS (left tree)
        public static async Task<srKeystoneInstanceService.BlockHeaderItemDTO[]> GetContactBlocks(long memberId, long memberTypeId, long projectId)
        {
            var u = await BlockHeaderGetNavigation(_keystoneIP, "InstanceService", _module_contacts, memberId, memberTypeId, projectId);
            var headers = u.BlockHeaderGetNavigationResult;
            return headers;
        }

        //CONTACTS LIST  eg. 154035
        public static async Task<srKeystoneInstanceReadOnlyService.SearchPagingDataSetResultDTO> GetContactList(long memberId, long memberTypeId, long projectId, long filterId)
        {
            var v = await GetContactsByFilter(_keystoneIP, "InstanceReadOnlyService", _module_contacts, memberId, memberTypeId, projectId, filterId);
            var records = v.vProjectFilterExecuteFilterWithCriteriaResult;
            return records;
        }

        //FORM CONFIG BLOCKHEADERS (left tree)
        public static async Task<srKeystoneInstanceService.BlockHeaderItemDTO[]> GetFormConfigBlocks(long memberId, long memberTypeId, long projectId)
        {
            var u = await BlockHeaderGetNavigation(_keystoneIP, "InstanceService", _module_forms, memberId, memberTypeId, projectId);
            var headers = u.BlockHeaderGetNavigationResult;
            return headers;
        }

        //FORM CONFIG PROPERTY LIST  eg. 154029
        public static async Task<srKeystoneInstanceReadOnlyService.SearchPagingDataSetResultDTO> GetFormConfigPropertyList(long memberId, long memberTypeId, long projectId, long filterId)
        {
            var v = await GetFormPropertiesViaFilter(_keystoneIP, "InstanceReadOnlyService", _module_forms, memberId, memberTypeId, projectId, filterId);
            var records = v.vProjectFilterExecuteFilterWithCriteriaFormPropertiesResult;
            return records;
        }

        //FILTER BLOCKHEADERS (left tree)
        public static async Task<srKeystoneInstanceService.BlockHeaderItemDTO[]> GetFilterBlocks(long memberId, long memberTypeId, long projectId)
        {
            var u = await GetBlockHeaders(_keystoneIP, "InstanceService", _module_messages, memberId, memberTypeId, projectId);
            var headers = u.BlockHeaderGetNavigationResult;
            return headers;
        }

        //MESSAGE LIST  eg. 154029
        public static async Task<srKeystoneInstanceReadOnlyService.SearchPagingDataSetResultDTO> GetMessageList(long memberId, long memberTypeId, long projectId, long filterId)
        {
            var v = await GetFormsAndFiltersByFilter(_keystoneIP, "InstanceReadOnlyService", _module_messages, memberId, memberTypeId, projectId, filterId);
            var records = v.vProjectFormGetMessagesFilterTableResult;
            return records;
        }

        //PROXY USERS LIST
        public static async Task<srKeystoneInstanceService.MemberInfoDTO[]> GetProxyUsers(long memberId, long memberTypeId, long projectId)
        {
            var u = await GetProxyMembers(_keystoneIP, "InstanceService", _module_messages, memberId, memberTypeId, projectId);
            var items = u.PermissionRestrictionGetProxyableMembersResult;
            return items;
        }









    }
}
