package run.halo.starter.domain;

import lombok.Data;

@Data
public class R<T> {
    private Integer code;

    private String message;

    private T data;

    public R(Integer code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    static public <T> R<T> success(T data) {
        return new R<>(200, "success", data);
    }

    static public <T> R<T> fail(String message) {
        return new R<>(500, message, null);
    }
}
