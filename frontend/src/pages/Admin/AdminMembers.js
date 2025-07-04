import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Mail, Calendar, BookOpen, Edit, Trash2, Eye, X, Save, UserPlus, Plus, User, Lock } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AdminMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: ''
  });
  const [addFormData, setAddFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: ''
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllMembers();
      setMembers(response.data);
    } catch (error) {
      toast.error('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setEditFormData({
      fullName: member.fullName || '',
      email: member.email || ''
    });
    setShowEditModal(true);
  };

  const handleViewMember = async (member) => {
    try {
      const response = await adminAPI.getMemberById(member.id);
      setSelectedMember(response.data);
      setShowViewModal(true);
    } catch (error) {
      toast.error('Failed to fetch member details');
    }
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    try {
      const response = await adminAPI.updateMember(selectedMember.id, editFormData);
      setMembers(members.map(member =>
        member.id === selectedMember.id ? response.data : member
      ));
      setShowEditModal(false);
      setSelectedMember(null);
      toast.success('Member updated successfully!');
    } catch (error) {
      toast.error('Failed to update member');
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      try {
        await adminAPI.deleteMember(memberId);
        setMembers(members.filter(member => member.id !== memberId));
        toast.success('Member deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete member. Member may have active borrowings.');
      }
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      console.log('Creating member with data:', addFormData);

      // Validate form data
      if (!addFormData.username || !addFormData.password || !addFormData.fullName || !addFormData.email) {
        toast.error('All fields are required');
        return;
      }

      if (addFormData.password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
      }

      const response = await adminAPI.createMember(addFormData);
      console.log('Member created successfully:', response.data);

      setMembers([...members, response.data]);
      setShowAddModal(false);
      setAddFormData({ username: '', password: '', fullName: '', email: '' });
      toast.success('Member created successfully!');

      // Refresh the members list to ensure we have the latest data
      fetchMembers();
    } catch (error) {
      console.error('Error creating member:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create member';
      toast.error(errorMessage);
    }
  };

  const closeModals = () => {
    setShowEditModal(false);
    setShowViewModal(false);
    setShowAddModal(false);
    setSelectedMember(null);
    setEditFormData({ fullName: '', email: '' });
    setAddFormData({ username: '', password: '', fullName: '', email: '' });
  };

  const filteredMembers = members.filter(member =>
    member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Manage Members</h1>
              <p className="text-gray-600">View and manage library members</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </motion.div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{member.fullName || 'N/A'}</h3>
                  <p className="text-sm text-gray-600">Member ID: {member.id}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{member.email || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Joined: January 2024</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  <span>Books borrowed: 5</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Active
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewMember(member)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditMember(member)}
                      className="text-primary-600 hover:text-primary-800 p-1"
                      title="Edit Member"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No members found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </motion.div>
        )}

        {/* Edit Member Modal */}
        {showEditModal && selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Member</h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleUpdateMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editFormData.fullName}
                    onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Update Member</span>
                  </button>
                  <button type="button" onClick={closeModals} className="btn-outline">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Member Modal */}
        {showViewModal && selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Member Details</h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{selectedMember.fullName}</h3>
                    <p className="text-gray-600">Member ID: {selectedMember.id}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Email</span>
                    </div>
                    <p className="text-gray-900">{selectedMember.email}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Member Since</span>
                    </div>
                    <p className="text-gray-900">January 2024</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Borrowing Activity</span>
                    </div>
                    <p className="text-gray-900">5 books borrowed • 0 overdue</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Member Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New Member</h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={addFormData.username}
                      onChange={(e) => setAddFormData({...addFormData, username: e.target.value})}
                      className="input-field pl-10"
                      required
                      minLength={3}
                      maxLength={50}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      value={addFormData.password}
                      onChange={(e) => setAddFormData({...addFormData, password: e.target.value})}
                      className="input-field pl-10"
                      required
                      minLength={6}
                      maxLength={100}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={addFormData.fullName}
                      onChange={(e) => setAddFormData({...addFormData, fullName: e.target.value})}
                      className="input-field pl-10"
                      required
                      maxLength={100}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={addFormData.email}
                      onChange={(e) => setAddFormData({...addFormData, email: e.target.value})}
                      className="input-field pl-10"
                      required
                      maxLength={100}
                    />
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex items-center space-x-2">
                    <UserPlus className="w-4 h-4" />
                    <span>Create Member</span>
                  </button>
                  <button type="button" onClick={closeModals} className="btn-outline">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMembers;
