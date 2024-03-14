<script setup>
import { useRequest } from "vue-hooks-plus";
import dom2image from "dom-to-image";
import { notifySuccess } from "vuetify3-dialog";
import { getArticle, getArticleComment, createArticleComment } from "@/api";
import { useAuthStore } from "@/store/auth";
import { useGoTo } from "vuetify";

const goTo = useGoTo();

const { params } = useRoute();
const authStore = useAuthStore();

const { id } = params;
const articleId = ref(id);
const { data, loading, error } = useRequest(() => getArticle(articleId.value), {
  refreshDeps: [articleId],
});
const page = ref(1);
const pageSize = ref(10);
const {
  data: commentRes,
  loading: loadingComments,
  refresh: refreshComments,
} = useRequest(
  () => getArticleComment(articleId.value, page.value, pageSize.value),
  {
    refreshDeps: [articleId, page],
  }
);

const {
  data: createCommentRes,
  loading: loadingCreateComment,
  runAsync: createComment,
} = useRequest(createArticleComment, {
  manual: true,
});

const loadingShare = ref(false);

const handleShare = () => {
  const node = document.getElementById("shareArticle"); // 通过id获取dom
  // 删除不需要的dom
  const actions = document.getElementById("actions");
  actions.style.display = "none";
  loadingShare.value = true;
  dom2image
    .toPng(node)
    .then((dataUrl) => {
      const a = document.createElement("a");
      const event = new MouseEvent("click");
      a.download = new Date().getTime() + ".png";
      a.href = dataUrl;
      a.dispatchEvent(event);
      actions.style.display = "flex";
      loadingShare.value = false;
    })
    .catch(function (error) {
      console.error(error);
      actions.style.display = "flex";
      loadingShare.value = false;
    });
};

const commentContent = ref("");

const replyContent = ref("");

const handleSubmit = async () => {
  await createComment({
    article_id: articleId.value,
    content: commentContent.value,
    parent_comment_id: 0,
    reply_id: 0,
  });
  if (createCommentRes.value.code === 200) {
    notifySuccess("评论成功", {
      location: "bottom center",
    });
    page.value = 1;
    commentContent.value = "";
    refreshComments();
  }
};

const handleSubmitReply = async () => {
  await createComment({
    article_id: articleId.value,
    content: replyContent.value,
    parent_comment_id: parentCommentId.value,
    reply_id: replyId.value,
  });
  if (createCommentRes.value.code === 200) {
    notifySuccess("回复成功", {
      location: "bottom center",
    });
    page.value = 1;
    replyContent.value = "";
    refreshComments();
    toggleReplyFormDialog();
    replyDialog.value = false;
  }
};

const replyFormDialog = ref(false);

const toggleReplyFormDialog = () => {
  replyFormDialog.value = !replyFormDialog.value;
  replyContent.value = "";
};

const parentCommentId = ref(0);
const replyId = ref(0);

const handleReply = (parent_comment_id, reply_id) => {
  parentCommentId.value = parent_comment_id;
  replyId.value = reply_id;
  toggleReplyFormDialog();
};

const currentReplyKey = ref(null);
const currentReply = ref([]);

const replyDialog = ref(false);

const toggleReplyDialog = () => {
  replyDialog.value = !replyDialog.value;
};

const handleGetReply = (index) => {
  currentReply.value = commentRes.value.data.list[index].sub_comment;
  currentReplyKey.value = index;
  toggleReplyDialog();
};
</script>

<template>
  <div>
    <v-overlay
      v-model="loadingShare"
      class="align-center justify-center"
      persistent
    >
      <div class="text-center">
        <v-list class="py-2" color="primary" elevation="12" rounded="lg">
          <v-list-item prepend-icon="mdi-download-outline" title="正在生成图片">
            <template v-slot:prepend>
              <div class="pe-4">
                <v-icon color="primary" size="x-large"></v-icon>
              </div>
            </template>

            <template v-slot:append>
              <v-progress-circular
                class="ml-4"
                color="primary"
                indeterminate="disable-shrink"
                size="16"
                width="2"
              ></v-progress-circular>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </v-overlay>
    <template v-if="loading">
      <div>
        <v-skeleton-loader
          type="card,article,article,actions"
          class="mx-auto"
          max-width="800"
        />
      </div>
    </template>
    <template v-else-if="!loading && data.code != 200">
      <div>
        <v-empty-state
          icon="mdi-alert-circle-outline"
          title="没有找到此文章"
          text="请确认文章是否存在或者联系管理员"
        ></v-empty-state>
      </div>
    </template>
    <template v-else>
      <div id="shareArticle">
        <v-card class="mx-auto" max-width="800">
          <v-img
            :src="'https://picsum.photos/400/400?random=1&' + data.data.id"
            class="align-end text-white"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="300"
            weight="200"
            cover
          >
            <v-card-title v-text="data.data.title"></v-card-title>
          </v-img>
          <v-list>
            <v-list-item
              :prepend-avatar="data.data.user.avatar"
              :subtitle="
                '发表于 ' +
                $dayjs
                  .unix(data.data.created_time)
                  .format('YYYY-MM-DD HH:mm:ss')
              "
              :title="data.data.user.nickname"
            >
              <template v-slot:append>
                <v-btn icon="mdi-menu-down" size="small" variant="text"></v-btn>
              </template>
            </v-list-item>
          </v-list>
          <div class="px-4 my-4">
            <render :md="data.data.content"></render>
          </div>
          <v-divider></v-divider>
          <v-card-actions id="actions">
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>mdi-thumb-up-outline</v-icon>
            </v-btn>
            <v-btn
              v-if="data.data.user.id === authStore.user.id"
              :to="`/articles/edit/${data.data.id}`"
              icon
            >
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn @click="handleShare" icon>
              <v-icon>mdi-share-variant-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </template>
    <template v-if="loadingComments">
      <div>
        <v-skeleton-loader
          class="mt-10 mx-auto"
          type="subtitle,list-item-avatar-two-line,list-item-avatar-two-line"
          max-width="800"
        />
      </div>
    </template>
    <template v-else>
      <div>
        <div id="comments" class="mt-10">
          <v-card max-width="800" class="mx-auto">
            <v-list lines="two">
              <div class="text-h5 my-5 ml-5">评论</div>
              <div class="pa-5">
                <form @submit.prevent="handleSubmit">
                  <v-textarea
                    clearable
                    label="说点什么吧"
                    variant="outlined"
                    v-model="commentContent"
                    required
                  ></v-textarea>
                  <div class="d-flex">
                    <v-spacer></v-spacer>
                    <v-btn variant="outlined" color="primary" type="submit"
                      >发布</v-btn
                    >
                  </div>
                </form>
              </div>
              <v-list-item
                v-for="(topComment, key) in commentRes.data.list"
                :key="topComment.id"
                :prepend-avatar="topComment.user.avatar"
              >
                <template v-slot:append>
                  <v-btn
                    color="grey-darken-1"
                    variant="text"
                    @click="() => handleReply(topComment.id, 0)"
                  >
                    <v-icon>mdi-reply-outline</v-icon>
                    回复</v-btn
                  >
                </template>
                <v-list-item-title
                  class="text-weight-bold"
                  v-text="topComment.user.nickname"
                ></v-list-item-title>
                <div class="text-body-2" v-text="topComment.content"></div>
                <v-list-item-subtitle
                  class="mt-2"
                  v-text="
                    $dayjs
                      .unix(topComment.comment_date)
                      .format('YYYY-MM-DD HH:mm:ss')
                  "
                ></v-list-item-subtitle>
                <v-list-item-subtitle
                  v-if="topComment.sub_comment.length > 0"
                  class="mt-2"
                  >共{{ topComment.sub_comment.length }}条回复,
                  <a
                    @click="() => handleGetReply(key)"
                    class="text-primary cursor-pointer"
                  >
                    点击查看</a
                  >
                </v-list-item-subtitle>
                <v-divider
                  class="my-2"
                  v-if="commentRes.data.list.length !== key - 1"
                ></v-divider>
              </v-list-item>
            </v-list>
            <v-pagination
              class="my-5"
              v-model="page"
              :length="
                commentRes?.data?.totalPage ? commentRes.data.totalPage : 1
              "
              @update:model-value="() => goTo(0, { container: '#comments' })"
              color="primary"
            ></v-pagination>
          </v-card>
        </div>
      </div>
    </template>
    <v-dialog
      v-model="replyDialog"
      transition="dialog-bottom-transition"
      fullscreen
    >
      <v-card>
        <v-toolbar color="primary">
          <v-btn icon="mdi-close" @click="toggleReplyDialog"></v-btn>

          <v-toolbar-title>全部回复</v-toolbar-title>

          <v-spacer></v-spacer>
        </v-toolbar>

        <v-list lines="two">
          <v-list-item
            v-for="(subComment, key) in currentReply"
            :key="subComment.id"
            :prepend-avatar="subComment.user.avatar"
          >
            <template v-slot:append>
              <v-btn
                color="grey-darken-1"
                variant="text"
                @click="
                  () =>
                    handleReply(
                      commentRes.data.list[currentReplyKey].id,
                      subComment.id
                    )
                "
              >
                <v-icon>mdi-reply-outline</v-icon>
                回复</v-btn
              >
            </template>
            <v-list-item-title
              class="text-weight-bold"
              v-text="subComment.user.nickname"
            ></v-list-item-title>
            <div class="text-body-2">
              <span v-if="subComment.reply_id !== 0">
                回复
                <a class="cursor-pointer text-primary"
                  >@{{ subComment.reply_comment.user.nickname }}</a
                >:
              </span>
              {{ subComment.content }}
            </div>
            <v-list-item-subtitle
              class="mt-2"
              v-text="
                $dayjs
                  .unix(subComment.comment_date)
                  .format('YYYY-MM-DD HH:mm:ss')
              "
            ></v-list-item-subtitle>
            <v-divider
              class="my-2"
              v-if="currentReply.length !== key - 1"
            ></v-divider>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
    <v-dialog v-model="replyFormDialog" max-width="600">
      <form @submit.prevent="handleSubmitReply">
        <v-card prepend-icon="mdi-reply-outline" title="回复">
          <div class="pa-5">
            <v-textarea
              clearable
              label="说点什么吧"
              variant="outlined"
              v-model="replyContent"
              required
              autofocus
            ></v-textarea>
          </div>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn variant="plain" @click="toggleReplyFormDialog">取消</v-btn>

            <v-btn color="primary" variant="outlined" type="submit">发布</v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>
  </div>
</template>

<style scoped></style>
