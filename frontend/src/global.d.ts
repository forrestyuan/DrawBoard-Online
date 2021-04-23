/// <reference types="mdui" />
declare namespace mdui {
  export interface IMduiStatic extends MduiReloadMethods {
    /** 打开一个提示用户输入的对话框 */
    prompt(
      onConfirm?: (v: string, e: MduiDialogsInstance) => void,
      onCancel?: (v: string, e: MduiDialogsInstance) => void,
      options?: MduiDialogsPromptOptions
    );
    /** 打开一个提示用户输入的对话框 */
    prompt(
      title?: string,
      onConfirm?: (v: string, e: MduiDialogsInstance) => void,
      onCancel?: (v: string, e: MduiDialogsInstance) => void,
      options?: MduiDialogsPromptOptions
    );
  }

  export interface IMduiStatic extends MduiReloadMethods {
    snackbar(param: {
      /** Snackbar 的文本，该参数不能为空。 */
      message: string;
      /** 显示的位置 */
      position?:
        | "top"
        | "bottom"
        | "right-top"
        | "right-bottom"
        | "left-top"
        | "left-bottom";
      /** 在用户没有操作时多长时间自动隐藏，单位（毫秒）。 */
      timeout?: number;
      /** 按钮的文本。 */
      buttonText?: string;
      /** 按钮的文本颜色，可以是颜色名或颜色值，如 red、#ffffff、rgba(255, 255, 255, 0.3) 等。 */
      buttonColor?: string;
      /** 点击按钮时是否关闭 Snackbar。 */
      closeOnButtonClick?: boolean;
      /** 点击或触摸 Snackbar 以外的区域时是否关闭 Snackbar。 */
      closeOnOutsideClick?: boolean;
      /** 在 Snackbar 上点击的回调函数。 */
      onClick?: (e: Event) => void;
      /** 点击 Snackbar 上的按钮时的回调函数。 */
      onButtonClick?: (e: Event) => void;
      /** Snackbar 开始关闭时的回调函数。 */
      onClose?: (e: Event) => void;
    }): {
      /** 关闭 Snackbar，关闭后 Snackbar 会被销毁。*/
      close(): void;
    };
  }
}
