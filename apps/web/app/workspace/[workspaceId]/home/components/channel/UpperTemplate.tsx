const UpperTemplate = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        {/* Onboard new hires */}
        <div className="rounded-lg overflow-hidden bg-teal-50">
          <div className="p-4">
            <h3 className="font-semibold">Onboard new hires</h3>
            <p className="text-sm text-gray-600">Canvas template</p>
          </div>
          <div className="bg-white mx-4 mb-4 rounded-md p-3 shadow-sm">
            <div className="font-medium text-sm mb-2">Onboarding</div>
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-100 rounded-sm mr-2"></div>
                <div className="text-xs">Team</div>
              </div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 rounded-sm mr-2"></div>
                <div className="text-xs">Documents</div>
              </div>
              <div className="h-2 bg-gray-200 rounded w-2/3"></div>
              <div className="h-2 bg-teal-200 rounded w-1/2"></div>
              <div className="text-xs">Resources</div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>

        {/* Share employee benefits */}
        <div className="rounded-lg overflow-hidden bg-green-50">
          <div className="p-4">
            <h3 className="font-semibold">Share employee benefits</h3>
            <p className="text-sm text-gray-600">Canvas template</p>
          </div>
          <div className="bg-white mx-4 mb-4 rounded-md p-3 shadow-sm">
            <div className="font-medium text-sm mb-2">Benefits</div>
            <div className="space-y-2">
              <div className="text-xs">Enrollment</div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              <div className="flex items-center mt-2">
                <div className="w-4 h-4 bg-blue-100 rounded-sm mr-2"></div>
                <div className="text-xs">Medical, Dental, and Vision</div>
              </div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="flex gap-2 mt-1">
                <div className="h-8 w-1/3 bg-green-100 rounded"></div>
                <div className="h-8 w-1/3 bg-green-100 rounded"></div>
                <div className="h-8 w-1/3 bg-green-100 rounded"></div>
              </div>
              <div className="flex items-center mt-1">
                <div className="w-4 h-4 bg-yellow-100 rounded-sm mr-2"></div>
                <div className="text-xs">Financial</div>
              </div>
            </div>
          </div>
        </div>

        {/* Add quarterly plan */}
        <div className="rounded-lg overflow-hidden bg-yellow-50">
          <div className="p-4">
            <h3 className="font-semibold">Add quarterly plan</h3>
            <p className="text-sm text-gray-600">List template</p>
          </div>
          <div className="bg-white mx-4 mb-4 rounded-md p-3 shadow-sm">
            <div className="font-medium text-sm mb-2">Quarterly Plan</div>
            <div className="space-y-3">
              <div className="h-2 bg-gray-200 rounded w-full"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-yellow-400 rounded-full mr-2 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="text-xs text-blue-500">Q1</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-orange-400 rounded-full mr-2 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="text-xs text-blue-500">Q1</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-400 rounded-full mr-2 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="text-xs text-red-500">Q2</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-blue-400 rounded-full mr-2 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="text-xs text-red-500">Q2</div>
              </div>
            </div>
          </div>
        </div>

        {/* Invite teammates */}
        <div className="rounded-lg overflow-hidden bg-purple-50">
          <div className="p-4">
            <h3 className="font-semibold">Invite teammates</h3>
            <p className="text-sm text-gray-600">Add your whole team</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 p-4">
            <div className="w-20 h-20 bg-green-200 rounded-md overflow-hidden">
              <div className="w-full h-full relative">
                <div className="absolute inset-0 flex items-end">
                  <div className="w-full h-1/2 bg-gradient-to-t from-green-300 to-transparent"></div>
                </div>
              </div>
            </div>
            <div className="w-20 h-20 bg-blue-200 rounded-md overflow-hidden">
              <div className="w-full h-full relative">
                <div className="absolute inset-0 flex items-end">
                  <div className="w-full h-1/2 bg-gradient-to-t from-blue-300 to-transparent"></div>
                </div>
              </div>
            </div>
            <div className="w-20 h-20 bg-pink-200 rounded-md overflow-hidden">
              <div className="w-full h-full relative">
                <div className="absolute inset-0 flex items-end">
                  <div className="w-full h-1/2 bg-gradient-to-t from-pink-300 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default UpperTemplate;
