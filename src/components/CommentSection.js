import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  ThumbUp as ThumbUpIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Report as ReportIcon,
} from '@mui/icons-material';

// Dữ liệu mẫu cho bình luận
const sampleComments = [
  {
    id: 1,
    user: {
      id: 1,
      name: 'Người dùng 1',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    content: 'Phim hay quá! Tôi rất thích diễn xuất của các diễn viên.',
    createdAt: '2023-05-15T10:30:00',
    likes: 5,
    liked: false,
  },
  {
    id: 2,
    user: {
      id: 2,
      name: 'Người dùng 2',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    content: 'Cốt truyện hơi khó hiểu, nhưng kỹ xảo thì tuyệt vời.',
    createdAt: '2023-05-14T15:45:00',
    likes: 3,
    liked: true,
  },
  {
    id: 3,
    user: {
      id: 3,
      name: 'Người dùng 3',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    content: 'Tôi nghĩ phần 1 hay hơn phần này. Nhưng vẫn đáng xem!',
    createdAt: '2023-05-13T09:20:00',
    likes: 2,
    liked: false,
  },
];

const CommentSection = ({ movieId }) => {
  const [comments, setComments] = useState(sampleComments);
  const [newComment, setNewComment] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Xử lý đăng bình luận mới
  const handlePostComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      user: {
        id: 0, // Giả định người dùng hiện tại
        name: 'Bạn',
        avatar: 'https://i.pravatar.cc/150?img=8',
      },
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
      liked: false,
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  // Xử lý mở menu tùy chọn
  const handleOpenMenu = (event, comment) => {
    setAnchorEl(event.currentTarget);
    setSelectedComment(comment);
  };

  // Xử lý đóng menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Xử lý thích/bỏ thích bình luận
  const handleToggleLike = (commentId) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
            liked: !comment.liked,
          };
        }
        return comment;
      })
    );
  };

  // Xử lý chỉnh sửa bình luận
  const handleEditComment = () => {
    handleCloseMenu();
    setEditMode(true);
    setEditContent(selectedComment.content);
  };

  // Xử lý lưu bình luận đã chỉnh sửa
  const handleSaveEdit = () => {
    if (!editContent.trim()) return;

    setComments(
      comments.map((comment) => {
        if (comment.id === selectedComment.id) {
          return {
            ...comment,
            content: editContent,
          };
        }
        return comment;
      })
    );

    setEditMode(false);
    setEditContent('');
    setSelectedComment(null);
  };

  // Xử lý hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditContent('');
    setSelectedComment(null);
  };

  // Xử lý xóa bình luận
  const handleDeleteComment = () => {
    handleCloseMenu();
    setOpenDeleteDialog(true);
  };

  // Xác nhận xóa bình luận
  const confirmDeleteComment = () => {
    setComments(comments.filter((comment) => comment.id !== selectedComment.id));
    setOpenDeleteDialog(false);
    setSelectedComment(null);
  };

  // Format thời gian
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        mb: 4,
        backgroundColor: 'background.paper',
      }}
    >
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
        Bình luận ({comments.length})
      </Typography>

      {/* Form đăng bình luận */}
      <Box sx={{ display: 'flex', mb: 4, gap: 2 }}>
        <Avatar src="https://i.pravatar.cc/150?img=8" alt="Bạn" />
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Viết bình luận của bạn..."
            variant="outlined"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              onClick={handlePostComment}
              disabled={!newComment.trim()}
            >
              Đăng
            </Button>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Danh sách bình luận */}
      {comments.length > 0 ? (
        <List>
          {comments.map((comment) => (
            <React.Fragment key={comment.id}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  comment.user.id === 0 && (
                    <IconButton
                      edge="end"
                      aria-label="more"
                      onClick={(e) => handleOpenMenu(e, comment)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  )
                }
                sx={{ py: 2 }}
              >
                <ListItemAvatar>
                  <Avatar src={comment.user.avatar} alt={comment.user.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" component="span" sx={{ fontWeight: 'bold' }}>
                        {comment.user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(comment.createdAt)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    editMode && selectedComment?.id === comment.id ? (
                      <Box sx={{ mt: 1 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Button size="small" onClick={handleCancelEdit}>
                            Hủy
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={handleSaveEdit}
                            disabled={!editContent.trim()}
                          >
                            Lưu
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <>
                        <Typography
                          variant="body1"
                          color="text.primary"
                          sx={{ mt: 1, whiteSpace: 'pre-line' }}
                        >
                          {comment.content}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Button
                            size="small"
                            startIcon={
                              comment.liked ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOutlinedIcon fontSize="small" />
                            }
                            onClick={() => handleToggleLike(comment.id)}
                            color={comment.liked ? 'primary' : 'inherit'}
                            sx={{ mr: 1 }}
                          >
                            {comment.likes > 0 && comment.likes}
                          </Button>
                          <Button size="small" color="inherit">
                            Trả lời
                          </Button>
                        </Box>
                      </>
                    )
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body1" align="center" sx={{ py: 4, fontStyle: 'italic' }}>
          Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
        </Typography>
      )}

      {/* Menu tùy chọn cho bình luận */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEditComment}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleDeleteComment} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Xóa
        </MenuItem>
      </Menu>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xóa bình luận</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa bình luận này không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button onClick={confirmDeleteComment} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CommentSection;