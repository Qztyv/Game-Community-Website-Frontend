<template>
  <button
    :data-target="'delete-modal-' + uniqueKey"
    class="delete-button waves-effect waves-light btn-small red lighten-2 modal-trigger"
  >
    <slot name="button-text"></slot>
  </button>

  <div :id="'delete-modal-' + uniqueKey" class="modal">
    <div class="modal-content">
      <h4 class="card-panel blue-grey darken-1 white-text">
        Delete Confirmation
      </h4>
      <p><slot name="button-popup-text"></slot></p>
    </div>
    <div class="modal-footer">
      <a class="delete-no modal-close waves-effect red lighten-2 btn-small"
        >No</a
      >
      <a
        class="delete-yes modal-close waves-effect green darken-1 btn-small"
        @click="$emit('deleteDocument', uniqueKey)"
      >
        Yes </a
      >⠀
    </div>
  </div>
</template>

<script>
import M from "materialize-css";
import { onMounted } from "vue";
export default {
  props: {
    uniqueKey: {
      type: [String, Number],
      required: true,
    },
  },
  emits: ["deleteDocument"],
  setup() {
    onMounted(() => {
      M.AutoInit();
    });
  },
};
</script>

<style scoped>
.delete-button {
  height: 25px;
  line-height: 25px;
  font-size: 11px;
  margin-left: 5px;
}
.modal .modal-content {
  padding: 12px;
}

.modal .modal-footer .btn,
.modal .modal-footer .btn-large,
.modal .modal-footer .btn-small,
.modal .modal-footer .btn-flat {
  margin-right: 5px;
}
</style>
