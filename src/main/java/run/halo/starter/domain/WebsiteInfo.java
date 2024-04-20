package run.halo.starter.domain;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WebsiteInfo {
    private String title;

    private String description;

    private String originHref;

    private String coverUrl;

    private String iconUrl;

}
