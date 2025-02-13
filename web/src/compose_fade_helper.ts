import type {Message} from "./message_store.ts";
import {realm} from "./state_data.ts";
import * as sub_store from "./sub_store.ts";
import type {Recipient} from "./util.ts";
import * as util from "./util.ts";

let focused_recipient: Recipient | undefined;

export function should_fade_message(message: Message): boolean {
    return !util.same_recipient(focused_recipient, message);
}

export function clear_focused_recipient(): void {
    focused_recipient = undefined;
}

export function set_focused_recipient(recipient?: Recipient): void {
    focused_recipient = recipient;
}

export function want_normal_display(): boolean {
    // If we're not composing show a normal display.
    if (focused_recipient === undefined) {
        return true;
    }

    // If the user really hasn't specified anything let, then we want a normal display
    if (focused_recipient.type === "stream") {
        // If a stream doesn't exist, there is no real chance of a mix, so fading
        // is just noise to the user.
        if (!sub_store.get(focused_recipient.stream_id)) {
            return true;
        }

        // If the topic is empty, and the realm requires topics, then we want a normal display.
        if (focused_recipient.topic === "" && realm.realm_mandatory_topics) {
            return true;
        }
    }

    return focused_recipient.type === "private" && focused_recipient.reply_to === "";
}
