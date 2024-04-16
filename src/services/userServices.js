let userServices = {
    getList: async (data) => {
        const {pagingParams, filterParams} = data;
        const { orderBy, keyword, pageIndex, pageSize } = pagingParams;
        const { user_id } = filterParams;

        const searchCriteria = {};
        if (user_id.length > 0) {
            searchCriteria.user_id = user_id;
        }
        if (keyword) {
            searchCriteria.username = keyword;
        }

        }
}


export default userServices;



